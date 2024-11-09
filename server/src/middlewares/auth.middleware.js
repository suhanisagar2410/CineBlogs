import { User } from '../models/user.model.js';
import jwt from "jsonwebtoken";


export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const user = await User.findOne({token: token});
        if (!user) {
            return res.status(404).json({ message: 'User not found , please check auth token!...' });
        }
        req.user = user;
        next(); 
    } catch (error) {
        console.error(error);
        return res.status(403).json({ message: 'Invalid token.' });
    }
};
