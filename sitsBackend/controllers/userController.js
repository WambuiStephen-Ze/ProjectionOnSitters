import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, getUserById, getUserByEmail, updateUser } from '../models/index.js';

export const registerParent = async (req, res) => {
    try {
        const { 
            firstname, 
            lastname, 
            email, 
            phone, 
            password, 
            location, 
            numKids, 
            ageKids,
            profilePic 
        } = req.body;

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
            ageKids,
            profilePic
        });

        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email }, 
            process.env.JWT_SECRET, { expiresIn: '1h' }
        );

        console.log('New user created:', newUser);
        res.redirect('/api/users/login'); // Redirect to login after successful registration

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
            return res.status(401).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Wrong password' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email }, 
            process.env.JWT_SECRET, { expiresIn: '1h' }
        );

        console.log('User login successful:', { userId: user.id, email: user.email });

        res.redirect('/api/sitters'); // Redirect to sitters page after successful login

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