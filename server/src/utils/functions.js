import jwt from "jsonwebtoken";
export const successResponse = ({ res, message, data }) => {
    return res.status(200).json({ message, data })
}

export const errorResponse = (res, message, error) => {
    return res.status(400).json({ message, error })
}

export const catchResponse = (res, message, error) => {
    return res.status(500).json({ message, error })
}

export const generateAccessToken = ({ username, email }) => {
    return jwt.sign(
        {
             username, email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};