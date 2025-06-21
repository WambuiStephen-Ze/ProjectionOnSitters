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
// ✅ Global error handler (should be last middleware)
app.use((err, req, res, next) => {
    console.error('Global error:', err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

/*
    * Routes have been moved to their respective files
    * This is to keep the code organized and maintainable.
    * If you need to access routes for users, go to `routes/userRoutes.js`
    * If you need to access routes for sitters, go to `routes/sitterRoutes.js`
    * If you need to access routes for bookings, go to `routes/bookingRoutes.js`
    * If you need to access routes for authentication, go to `routes/authRoutes.js`
    * 
    * Keep the workflow simple and organized.
    * If you need to add more routes, create a new file in the `routes` directory
    * and import it here.
*/

/*
    * HOW TO USE THE ROUTES
    * 1. For sitters, use the `/api/sitters` endpoint.
    * 2. For bookings, use the `/api/bookings` endpoint.
    * 3. For users, use the `/api/users` endpoint.
    * 4. For authentication, use the `/api/auth` endpoint.
    * 
    * Example: To register a user, send a POST request to `/api/users/register`
    * Example: To get all sitters, send a GET request to `/api/sitters`
*/

// ✅ Frontend Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

app.get('/api/payment-details', (req, res) => {
    res.json({
        companyName: 'Sits.com',
        paybill: '123456',
        accountNumber: 'SITS-001',
    });
});

export default app;