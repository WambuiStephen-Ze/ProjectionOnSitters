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
import fs from 'fs';

// Importing necessary sitters controllers
import { loginSitter, registerSitter } from '../controllers/sitterController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Dynamically adding directories for sitters profile pic upload if it doesn't exist
const destPath = path.join(__dirname, '../../frontend/uploads/sitters_profilePic');
if (!fs.existsSync(destPath)) {
  fs.mkdirSync(destPath, { recursive: true });
}
 // const secret = process.env.JWT_SECRET || 'your-default-secret';


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, destPath);
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

router.get('/data', async (req, res) => {
  try {
    const sitters = await Sitter.findAll();
    res.json(sitters);
  } catch (error) {
    console.error('Error fetching sitters: ', error);
    res.status(500).json({
      message: 'Failed to fetch sitters',
      error: error.message
      });
  }
});

router.get('/signup', (req, res) => {
  console.log('Am sitters register');
  res.sendFile(path.join(__dirname, '../../frontend', 'signup.html'));
});

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend', 'sitter.login.html'));
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



// Routers to handle all post requests for the sitters
router.post('/register', upload.single('profilePic'), registerSitter);
router.post('/login', loginSitter);


export default router;