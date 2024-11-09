import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
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

export const bcryptPassCompare = async (passToBeMatched, password) => {
    try {
        if (!passToBeMatched || !password) {
            throw new Error("Both passToBeMatched and password must be provided");
        }
        const result = await bcrypt.compare(passToBeMatched, password)
        return result
    } catch (error) {
        console.log(error)
    }
}

cloudinary.config({
    cloud_name: "dryrborda",
    api_key: "315133628997819",
    api_secret: "2bgDKqXAT7gMCOVmGZ2LDwzl_Q8",
});

export const uploadOnCloudinry = async (imagePath) => {
    if (!imagePath) return null;
    try {
        const response = await cloudinary.uploader.upload(imagePath);
        fs.unlinkSync(imagePath)
        return response;
    } catch (error) {
        fs.unlinkSync(imagePath)
        return new Error(error);
    }
};