import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authenticateToken = (req, res, next) => {
    const token = req.header('x-auth-token'); // Get token from header
    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token.' });
        }
        req.user = user; // Attach user data to request object
        next(); // Proceed to the next middleware or route handler
    });
};