import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bookingRoutes from './routes/bookingRoutes.js';
import { connectDB } from './models/index.js';
import userRoutes from './routes/userRoutes.js';
import sitterRoutes from './routes/sitterRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Database
connectDB();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// ✅ API Routes
app.use('/api/sitters', sitterRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// ✅ Frontend Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'login.html'));
});

app.get('/parent/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'register.html'));
});

app.get('/singup', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'signup.html'));
});

app.get('/sitters', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'sitters.html'));
});

app.get('/api/payment-details', (req, res) => {
    res.json({
        companyName: 'Sits.com',
        paybill: '123456',
        accountNumber: 'SITS-001',
    });
});

// ✅ Global error handler (should be last middleware)
app.use((err, req, res, next) => {
    console.error('Global error:', err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

export default app;
