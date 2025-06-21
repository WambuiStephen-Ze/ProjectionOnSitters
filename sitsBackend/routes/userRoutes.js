import express from 'express';
import { registerParent, getUser, updateUserData, loginParent } from '../controllers/userController.js';
import protect from '../middlewares/authMiddleware.js';


const router = express.Router();

router.post('/register', registerParent);
router.post('/login', loginParent);
router.get('/:id', protect, getUser);
router.put('/:id', protect, updateUserData);



export default router;