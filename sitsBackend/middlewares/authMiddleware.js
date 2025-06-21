import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided, authorization denied' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired, please log in again' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token, authorization denied' });
        }
        console.error('Token verification error:', error);
        return res.status(401).json({ message: 'Token verification failed, authorization denied' });
    }
};

export default protect;