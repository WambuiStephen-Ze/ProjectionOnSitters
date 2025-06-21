import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import { createUser, getUserById, updateUser, getUserByEmail } from '../models/index.js';
import protect from '../middlewares/authMiddleware.js';
import { loginParent } from '../controllers/authController.js';


const router = express.Router();
// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../frontend/uploads'));  // Adjust path if needed
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
router.post('/register', upload.single('profilePic'), async (req, res) => {
  try {
    const { name, email, password, location, numKids, phone } = req.body;
    const profilePic = req.file ? req.file.filename : null;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'Name, email, password, and phone are required' });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const [firstname, ...lastnameArr] = name.split(' ');
    const lastname = lastnameArr.join(' ') || 'Unknown';

    const newUser = await createUser({
      firstname,
      lastname,
      email,
      password,
      phone,
      profilePic,
      location,
      numKids,
    });

    const token = jwt.sign({ userId: newUser.id, email: newUser.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(201).json({ message: 'User registered successfully', userId: newUser.id, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.post('/login', loginParent);
router.post('/logout', protect, (req, res) => res.json({ message: 'Logout successful (client-side token removal)' }));
router.post('/refresh', protect, (req, res) => {
    const token = jwt.sign({ userId: req.user.userId, email: req.user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Token refreshed', token });
});

router.get('/me', protect, async (req, res) => {
    try {
        const user = await getUserById(req.user.userId);
        res.json({ id: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.put('/me', protect, async (req, res) => {
    try {
        const updates = req.body;
        if (updates.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        const user = await updateUser(req.user.userId, updates);
        res.json({ id: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.delete('/me', protect, async (req, res) => {
    try {
        const { User } = await import('../models/index.js');
        await getUserById(req.user.userId);
        await User.destroy({ where: { id: req.user.userId } });
        res.json({ message: 'User account deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;