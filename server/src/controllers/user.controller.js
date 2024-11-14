import { User } from "../models/user.model.js"
import joi from "joi"
import mongoose from "mongoose"
import { successResponse, errorResponse, catchResponse, generateAccessToken, bcryptPassCompare, uploadOnCloudinry } from "../utils/functions.js"
const userValidationSchema = joi.object({
    username: joi.string().min(3).max(15),
    email: joi.string().email().required(),
    password: joi.string().required().min(4),
    profileImage: joi.any()
})
const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const { error } = userValidationSchema.validate(req.body);

        const file = req.file
        if(!file) return errorResponse(res, "Profile image is required");
        if (error) return errorResponse(res, error.message);

        const userAlreadyExists = await User.findOne({ username });
        if (userAlreadyExists) return errorResponse(res, "User already exists");

        const existingEmail = await User.findOne({ email });
        if (existingEmail) return errorResponse(res, "Email already exists");
        
        const profileImageUrl = await uploadOnCloudinry(file.path)
        if(!profileImageUrl) return errorResponse(res, "Image not uploaded on cloudinary");

        const token = generateAccessToken({ username, email })
        const user = await User.create({ username, email, password, token, profileImage: profileImageUrl });
        if (!user) return errorResponse(res, "User not created");

        const userResponse = user.toObject();
        delete userResponse.password
        return successResponse({ res, message: "User created successfully", data: userResponse });
    } catch (error) {
        return catchResponse(res, "Error occurred creating user", error.message);
    }
};

const loginValidationSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required().min(4)
})

const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const { error } = await loginValidationSchema.validate(req.body)
        if (error) return errorResponse(res, error.message);

        const user = await User.findOne({ email })
        if (!user) return errorResponse(res, "User not found");
        const result = await bcryptPassCompare(password, user.password)
        if (result === false) return errorResponse(res, "Incorrect password");
        const username = user.username
        if (result === true) {
            const token = generateAccessToken({ username, email })

            const newUser = await User.findOneAndUpdate(
                { email },
                { token },
                { new: true }
            ).select("-password");
            if (!newUser) return errorResponse(res, "Token not updated");

            return successResponse({ res, message: "User login successfully", data: newUser });
        }
        return errorResponse(res, "Incorrect password");
    } catch (error) {
        return catchResponse(res, "Error occurred in login user", error.message);
    }
}

const logOut = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ email: req.user.email }, { token: "" })
        if (!user) return errorResponse(res, "User not updated");
        return successResponse({ res, message: "User logged out successfully", data: {} });
    } catch (error) {
        return catchResponse(res, "Error occurred in logout user", error.message);
    }
}

const getCurrentUser = async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return errorResponse(res, "User not found.");
      }
      
      const userResponse = user.toObject();
      delete userResponse.password;
      
      return successResponse({ res, message: "User found successfully", data: userResponse });
    } catch (error) {
      return catchResponse(res, "Error occurred in fetching current user", error.message);
    }
  };

const getUserById = async (req, res) => {
    try {
        const userId = req.params.id
        if (!mongoose.isValidObjectId(userId)) {
            return errorResponse("Invalid userId");
        }
        const user = await User.findOne({_id: userId}, '-password -__v')
        if (!user) return errorResponse(res, "User not found");
        return successResponse({ res, message: "User found successfully", data: user });
    } catch (error) {
        return catchResponse(res, "Error occurred in get user by id", error.message);
    }
}

export {
    createUser,
    login,
    logOut,
    getUserById,
    getCurrentUser
}