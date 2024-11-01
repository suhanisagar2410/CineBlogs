import { User } from '../models/user.model.js';
import jwt from "jsonwebtoken";


export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findOne({email : decoded.email});
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        req.user = user;
        next(); 
    } catch (error) {
        console.error(error);
        return res.status(403).json({ message: 'Invalid token.' });
    }
};
