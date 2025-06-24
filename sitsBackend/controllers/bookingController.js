import { Booking, User, Sitter } from '../models/index.js';
import { sendBookingConfirmation } from '../utils/emails.js';

export const createBooking = async (req, res) => {
    try {
        const { userId, sitterId, date, duration, confirmationEmail } = req.body;

        if (!userId || !sitterId || !date || !duration) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const user = await User.findByPk(userId);
        const sitter = await Sitter.findByPk(sitterId);

        if (!user || !sitter) {
            return res.status(404).json({ message: 'User or sitter not found' });
        }

        const existingBooking = await Booking.findOne({
            where: {
                sitterId,
                date,
                status: ['pending', 'confirmed']
            }
        });

        if (existingBooking) {
            return res.status(400).json({ message: 'Sitter is already booked at this time' });
        }

        const booking = await Booking.create({
            userId,
            sitterId,
            date: new Date(date),
            duration,
            status: 'pending',
            confirmationEmail: !!confirmationEmail
        });

        // 🔧 Send confirmation email
        if (confirmationEmail) {
            try {
                await sendBookingConfirmation(
                    sitter.email,
                    sitter.firstname,
                    user.firstname,
                    date
                );
                console.log(`📧 Email sent to ${sitter.email}`);
            } catch (emailErr) {
                console.error('📧 Email sending failed:', emailErr.message);
            }
        }

        return res.status(201).json({ message: 'Booking created successfully', booking });
    } catch (error) {
        console.error('Error creating booking:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id, {
            include: [
                { model: User, as: 'User' },
                { model: Sitter, as: 'Sitter' }
            ]
        });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        return res.status(200).json(booking);
    } catch (error) {
        console.error('Error fetching booking:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const updateBooking = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findByPk(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (status && !['pending', 'confirmed', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        await booking.update(req.body);
        return res.status(200).json({ message: 'Booking updated successfully', booking });
    } catch (error) {
        console.error('Error updating booking:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            where: { userId: req.params.userId },
            include: [
                { model: User, as: 'User' },
                { model: Sitter, as: 'Sitter' }
            ]
        });

        return res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.status === 'cancelled') {
            return res.status(400).json({ message: 'Booking is already cancelled' });
        }

        await booking.update({ status: 'cancelled' });
        return res.status(200).json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

