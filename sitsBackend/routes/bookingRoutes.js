import express from 'express';
import protect from '../middlewares/authMiddleware.js';
import { createBooking, getBookingById, updateBooking, getUserBookings, cancelBooking } from '../controllers/bookingController.js';
import { Sitter, User, Booking } from '../models/index.js';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const router = express.Router();

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Helper function to parse experience
const parseExperience = (experience) => {
    if (!experience) return 0;
    const match = experience.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
};

// Create a new booking
router.post('/secure', protect, async (req, res) => {
    try {
        const { sitterId, userId, date, duration } = req.body;

        if (!sitterId || !userId || !date || !duration) {
            return res.status(400).json({ message: 'Sitter ID, User ID, date, and duration are required' });
        }
        if (req.user.userId !== userId) {
            return res.status(403).json({ message: 'You can only create bookings for yourself' });
        }
        if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(date)) {
            return res.status(400).json({ message: 'Date must be in ISO format (e.g., 2025-06-03T10:00:00Z)' });
        }
        const bookingDate = new Date(date);
        if (bookingDate <= new Date()) {
            return res.status(400).json({ message: 'Booking date must be in the future' });
        }
        if (duration < 1) {
            return res.status(400).json({ message: 'Duration must be at least 1 hour' });
        }

        const user = await User.findByPk(userId);
        const sitter = await Sitter.findByPk(sitterId);
        if (!user || !sitter) {
            return res.status(404).json({ message: 'User or sitter not found' });
        }
        if (sitter.location !== user.location) {
            return res.status(400).json({ message: 'Sitter location does not match user location' });
        }

        // Check availability
        const day = bookingDate.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
        const availability = sitter.availability || {};
        if (!availability[day] || !availability[day].start || !availability[day].end) {
            return res.status(400).json({ message: 'Sitter is not available at the requested time' });
        }
        const bookingTime = bookingDate.toLocaleTimeString('en-US', { hour12: false });
        const [bookingHour] = bookingTime.split(':');
        const [startHour] = availability[day].start.split(':');
        const [endHour] = availability[day].end.split(':');
        if (bookingHour < startHour || bookingHour >= endHour) {
            return res.status(400).json({ message: 'Sitter is not available at the requested time' });
        }

        const sitterExperience = parseExperience(sitter.experience);
        if (sitterExperience < 1) {
            return res.status(400).json({ message: 'Sitter must have at least 1 year of experience' });
        }

        // Create booking
        const newBooking = await createBooking({
            body: { userId, sitterId, date, duration, confirmationEmail: true }
        }, { json: (data) => data });

        // Generate acceptance token
        const acceptToken = jwt.sign({ bookingId: newBooking.id, sitterId }, process.env.JWT_SECRET, { expiresIn: '24h' });

        // Send confirmation email to sitter
        const acceptUrl = `${process.env.BASE_URL}/api/bookings/accept/${newBooking.id}/${acceptToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: sitter.email,
            subject: 'Booking Confirmation - Action Required',
            text: `Dear ${sitter.firstname} ${sitter.lastname},\n\nA new booking has been requested for ${date}.\nDetails:\n- Parent: ${user.firstname} ${user.lastname}\n- Date: ${date}\n- Duration: ${duration} hours\n\nPlease confirm the booking by clicking here: ${acceptUrl}\n\nThank you for using Sits.com!`
        };
        await transporter.sendMail(mailOptions);

        res.status(201).json(newBooking);
    } catch (error) {
        console.error('Booking creation error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Sitter accepts booking
router.get('/accept/:id/:token', async (req, res) => {
    try {
        const { id, token } = req.params;

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(400).json({ message: 'Invalid or expired acceptance link' });
        }
        if (decoded.bookingId !== parseInt(id)) {
            return res.status(400).json({ message: 'Invalid acceptance link' });
        }

        // Fetch booking
        const booking = await Booking.findByPk(id, {
            include: [
                { model: User, as: 'User' },
                { model: Sitter, as: 'Sitter' }
            ]
        });
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        if (booking.sitterId !== decoded.sitterId) {
            return res.status(403).json({ message: 'Unauthorized to accept this booking' });
        }
        if (booking.status !== 'pending') {
            return res.status(400).json({ message: 'Booking is not in pending status' });
        }

        // Update booking status
        await booking.update({ status: 'confirmed' });

        // Create Zoom meeting
        let zoomLink;
        try {
            const zoomResponse = await axios.post('https://api.zoom.us/v2/users/me/meetings', {
                topic: `Sitter Booking - ${booking.User.firstname} & ${booking.Sitter.firstname}`,
                type: 2, // Scheduled meeting
                start_time: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
                duration: 60, // 1 hour
                timezone: 'UTC',
                settings: {
                    join_before_host: true,
                    participant_video: true,
                    host_video: true
                }
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.ZOOM_JWT_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });
            zoomLink = zoomResponse.data.join_url;
        } catch (zoomError) {
            console.error('Zoom API error:', zoomError);
            return res.status(500).json({ message: 'Failed to create Zoom meeting' });
        }

        // Send Zoom emails
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: [booking.User.email, booking.Sitter.email],
            subject: 'Booking Confirmed - Zoom Meeting Details',
            text: `Dear ${booking.User.firstname} and ${booking.Sitter.firstname},\n\nThe booking for ${booking.date} has been confirmed.\nJoin your Zoom meeting within the next 2 hours:\n- Zoom Link: ${zoomLink}\n- Date: ${booking.date}\n- Duration: ${booking.duration} hours\n\nThank you for using Sits.com!`
        };
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Booking confirmed. Zoom meeting details sent to both parties.' });
    } catch (error) {
        console.error('Booking acceptance error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Other routes
router.post('/', protect, createBooking);
router.get('/:id', protect, getBookingById);
router.put('/:id', protect, updateBooking);
router.get('/user/:userId', protect, getUserBookings);
router.put('/cancel/:id', protect, cancelBooking);

export default router;