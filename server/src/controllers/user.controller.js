import { User } from "../models/user.model.js"
import joi from "joi"
import { successResponse, errorResponse, catchResponse, generateAccessToken } from "../utils/functions.js"
const userValidationSchema = joi.object({
    username: joi.string().min(3).max(15),
    email: joi.string().email().required(),
    password: joi.string().required().min(4)
})
const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const { error } = userValidationSchema.validate(req.body);
        if (error) return errorResponse(res, error.message);

        const userAlreadyExists = await User.findOne({ username });
        if (userAlreadyExists) return errorResponse(res, "User already exists");

        const existingEmail = await User.findOne({ email });
        if (existingEmail) return errorResponse(res, "Email already exists");

        const token = generateAccessToken({ username, email })
        const user = await User.create({ username, email, password, token });
        if (!user) return errorResponse(res, "User not created");

        const userResponse = user.toObject();
        delete userResponse.password
        return successResponse({ res, message: "User created successfully", data: userResponse });
    } catch (error) {
        return catchResponse(res, "Error occurred creating user", error.message);
    }
};

export {
    createUser
}