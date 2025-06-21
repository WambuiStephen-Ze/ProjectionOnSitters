import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, getUserById, getUserByEmail, updateUser } from '../models/index.js';

export const registerParent = async (req, res) => {
    try {
        const { firstname, lastname, email, phone, password, location, numKids } = req.body;
        if (!firstname || !lastname || !email || !password || !phone) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const newUser = await createUser({
            firstname,
            lastname,
            email,
            phone,
            password,
            location,
            numKids,
        });
        const token = jwt.sign({ userId: newUser.id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: 'Parent registered successfully', userId: newUser.id, token });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const loginParent = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful', userId: user.id, token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getUser = async (req, res) => {
    try {
        const user = await getUserById(req.params.id);
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const updateUserData = async (req, res) => {
    try {
        const user = await updateUser(req.params.id, req.body);
        res.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};