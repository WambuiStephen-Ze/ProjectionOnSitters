import express from 'express';
// import  sitterProfile  from '../models/sitter.js';
import { User, Sitter}  from '../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import  authMiddleware  from '../middlewares/authMiddleware.js';
import { findMatchingSitters } from '../services/matchingService.js';
import { fileURLToPath } from 'url';
import path from 'path';
import multer from 'multer';

// Importing necessary sitters controllers
import { loginSitter, registerSitter } from '../controllers/sitterController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// const secret = process.env.JWT_SECRET || 'your-default-secret';


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../frontend/uploads/'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  },
});

const router = express.Router();

// Routers to handle all get requests for the sitters
router.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend', 'sitters.html'));
});

router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend', 'signup.html'));
});

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend', 'sitter.login.html'));
});



// Routers to handle all post requests for the sitters
router.post('/register', upload.single('profilePic'), registerSitter);

// This is irrelevant
router.post('/signup', upload.single('profilePic'), async (req, res) => {
  try {
    const { firstname, lastname, email, password, location, years, availability, phone } = req.body;

    // Debug log to check availability value
    console.log('Raw availability value:', availability);

    let availabilityJSON = null;
    if (availability) {
      try {
        availabilityJSON = typeof availability === 'string' ? JSON.parse(availability) : availability;
      } catch (err) {
        return res.status(400).json({ message: 'Invalid JSON for availability' });
      }
    }

    // ... rest of your logic

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstname,
      lastname,
      location,
      email,
      password: hashedPassword,
      phone,
      role: 'sitter',
    });
    await Sitter.create({
      userId: user.id,
      firstname,
      lastname,
      location,
      password,
      phone,
      email,
      experience: years,
      availability: availabilityJSON,
      profilePic: req.file ? `/uploads/${req.file.filename}` : null,
    });
    res.status(201).json({ message: 'Sitter registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});


// router.post('/signup', upload.single('profilePic'), async (req, res) => {
//   try {
//     const { firstname, lastname, email, password, location, years, availability, phone } = req.body;
    
//     const existingUser = await User.findOne({ where: { email } });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({
//       firstname,
//       lastname,
//       email,
//       password: hashedPassword,
//       phone,
//       role: 'sitter',
//     });
//     const availabilityJSON = JSON.parse(availability);
//     await sitterProfile.create({
//       userId: user.id,
//       location,
//       experience: years,
//       availability: availabilityJSON,
//       profilePic: req.file ? `/uploads/${req.file.filename}` : null,
//     });
//     res.status(201).json({ message: 'Sitter registered successfully' });
//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).json({ message: 'Registration failed', error: error.message });
//   }
// });

router.post('/login', loginSitter);

router.post('/sitterlogin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email, role: 'sitter' } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const secret = process.env.JWT_SECRET || 'my-super-secret';

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: 'sitter' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

router.get('/match', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId);
    if (!user || user.role !== 'parent') {
      return res.status(403).json({ message: 'Access restricted to parents' });
    }
    const sitters = await findMatchingSitters(user.location);
    res.json(sitters);
  } catch (error) {
    console.error('Matching error:', error);
    res.status(500).json({ message: 'Failed to find matching sitters', error: error.message });
  }
});

export default router;