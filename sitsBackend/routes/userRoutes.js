import express from 'express';
import { registerParent, getUser, updateUserData, loginParent } from '../controllers/userController.js';
import protect from '../middlewares/authMiddleware.js';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Set up multer for file uploads

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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