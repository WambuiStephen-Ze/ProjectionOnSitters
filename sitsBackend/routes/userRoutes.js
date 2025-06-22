import express from 'express';
import { registerParent, getUser, updateUserData, loginParent } from '../controllers/userController.js';
import protect from '../middlewares/authMiddleware.js';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import fs from 'fs';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Dynamically adding directories for users profile pic upload if it doesn't exist
const destPath = path.join(__dirname, '../../frontend/uploads/users_profilePics');

if (!fs.existsSync(destPath)) {
  fs.mkdirSync(destPath, { recursive: true });
}
 
// Set up multer for file uploads
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

// Router to handle all get requests for the users
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend', 'index.html'));
});

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend', 'register.html'));
});
 
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend', 'login.html'));
});

router.get('/:id', protect, getUser);

// Router to handle all post requests for the users
router.post('/register', upload.single('profilePic'), registerParent);
router.post('/login', loginParent);

// Router to handle all put requests for the users
router.put('/:id', protect, updateUserData);

export default router;