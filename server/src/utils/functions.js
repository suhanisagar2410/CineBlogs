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

export const uploadOnCloudinry = (filePath) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(filePath, (error, result) => {
        if (error) {
          reject(error);
        } else {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error("Failed to delete local file", err);
            } else {
              console.log("Local file deleted successfully.");
            }
          });
          resolve(result);
        }
      });
    });
};

  export const deleteImage = (publicId) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) reject(error);
        resolve(result);
      });
    });
  };
  