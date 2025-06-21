import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Sitter, Booking, getSitterByEmail } from '../models/index.js';

export const registerSitter = async (req, res) => {
    try {
        const { firstname, lastname, email, phone, password, location, experience, availability } = req.body;
        if (!firstname || !lastname || !email || !phone || !password || !experience) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const existingSitter = await getSitterByEmail(email);
        if (existingSitter) {
            return res.status(400).json({ message: 'Sitter already exists' });
        }
        const newSitter = await Sitter.create({
            firstname,
            lastname,
            email,
            phone,
            password,
            location,
            experience,
            availability,
        });
        const token = jwt.sign({ userId: newSitter.id, email: newSitter.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: 'Sitter registered successfully', sitterId: newSitter.id, token });
    } catch (error) {
        console.error('Sitter registration error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const loginSitter = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const sitter = await getSitterByEmail(email);
        if (!sitter) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, sitter.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: sitter.id, email: sitter.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful', sitterId: sitter.id, token });
    } catch (error) {
        console.error('Sitter login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getAllSitters = async (req, res) => {
    try {
        const sitters = await Sitter.findAll();
        res.json(sitters);
    } catch (error) {
        console.error('Error fetching sitters:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getSitterById = async (req, res) => {
    try {
        const sitter = await Sitter.findByPk(req.params.id);
        if (!sitter) {
            return res.status(404).json({ message: 'Sitter not found' });
        }
        res.json(sitter);
    } catch (error) {
        console.error('Error fetching sitter:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const updateSitter = async (req, res) => {
    try {
        const sitter = await Sitter.findByPk(req.params.id);
        if (!sitter) {
            return res.status(404).json({ message: 'Sitter not found' });
        }
        await sitter.update(req.body);
        res.json(sitter);
    } catch (error) {
        console.error('Error updating sitter:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getSitterProfileWithStatus = async (req, res) => {
    try {
        const sitter = await Sitter.findByPk(req.params.id, {
            include: [{ model: Booking, as: 'Bookings' }]
        });
        if (!sitter) {
            return res.status(404).json({ message: 'Sitter not found' });
        }
        res.json(sitter);
    } catch (error) {
        console.error('Error fetching sitter profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};