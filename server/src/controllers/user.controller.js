import { User } from "../models/user.model.js"
import joi from "joi"
import mongoose from "mongoose"
import { Follow } from "../models/followers.model.js"
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
        if (!file) return errorResponse(res, "Profile image is required");
        if (error) return errorResponse(res, error.message);

        const userAlreadyExists = await User.findOne({ username });
        if (userAlreadyExists) return errorResponse(res, "User already exists");

        const existingEmail = await User.findOne({ email });
        if (existingEmail) return errorResponse(res, "Email already exists");

        const profileImageUrl = await uploadOnCloudinry(file.path)
        if (!profileImageUrl) return errorResponse(res, "Image not uploaded on cloudinary");

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
        const user = await User.findOne({ _id: userId }, '-password -__v')
        if (!user) return errorResponse(res, "User not found");

        const followers = await Follow.find({ userId })
        const userData = {
            ...user.toObject(),
            followers: followers.length > 0 ? followers : [],
        };
        return successResponse({ res, message: "User found successfully", data: userData });
    } catch (error) {
        return catchResponse(res, "Error occurred in get user by id", error.message);
    }
}

const follow = async (req, res) => {
  try {
    const userId = req.user._id;
    const followId = req.params.followId;

    if (!userId || !followId) {
      return errorResponse(res, "FollowId is required");
    }

    if (!mongoose.isValidObjectId(followId)) {
      return errorResponse(res, "Invalid followId");
    }

    if (userId.toString() === followId.toString()) {
      return errorResponse(res, "You cannot follow yourself");
    }

    const follower = await User.findById(userId);
    if (!follower) {
      return errorResponse(res, "User not found");
    }

    const followObj = await Follow.findOne({
      userId: followId,
      "follower._id": follower._id,
    });

    if (followObj) {
      await Follow.findOneAndDelete({
        userId: followId,
        "follower._id": follower._id,
      });
      return successResponse({ res, message: "Unfollowed successfully", data: {} });
    } else {
      await Follow.create({
        userId: followId,
        follower: {
          _id: follower._id,
          username: follower.username,
          email: follower.email,
          profileImage: follower.profileImage || null,
        },
      });
      return successResponse({ res, message: "Followed successfully", data: {} });
    }
  } catch (error) {
    console.error(error);
    return catchResponse(res, "Error occurred in following", error.message);
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { bio, username, email } = req.body;
    const userId = req.user._id;

    const existingUser = await User.findById(userId);
    if (!existingUser) return errorResponse(res, "User not found");

    if (email && email !== existingUser.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) return errorResponse(res, "Email is already in use by another account");
    }

    let profileImageUrl = existingUser.profileImage;

    if (req.file) {

      if (existingUser.profileImage) {
        const publicId = existingUser.profileImage.split('/').pop().split('.')[0];
        await deleteImage(publicId);
      }
      
      const uploadResult = await uploadOnCloudinry(req.file.path);
      if (!uploadResult) return errorResponse(res, "Failed to upload the new image");

      profileImageUrl = uploadResult.url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { bio, username, email, profileImage: profileImageUrl },
      { new: true }
    );

    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    return successResponse({
      res,
      message: "Profile updated successfully",
      data: updatedUser
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return catchResponse(res, "updating profile", error.message);

  }
};

export {
    createUser,
    login,
    logOut,
    getUserById,
    getCurrentUser,
    follow,
    updateUserProfile
}
