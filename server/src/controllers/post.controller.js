import Joi from "joi"
import { Post } from "../models/post.model.js"
import { errorResponse, successResponse, catchResponse, uploadOnCloudinry } from "../utils/functions.js"
import { User } from "../models/user.model.js"


const postValidation = Joi.object({
    userId: Joi.string().required(),
    title: Joi.string().required(),
    content: Joi.string().min(5).required(),
    status: Joi.boolean().required()
})
const createPost = async (req, res) => {
    try {
        const { error } = postValidation.validate(req.body)
        if (error) return errorResponse(res, error.message);
        const { userId, title, content, status } = req.body;

        if(userId != req.user._id) return errorResponse(res, "User is not the same");

        const user = await User.findOne({_id: userId});
        if (!user) return errorResponse(res, "User not found");

        const imageUrl = await uploadOnCloudinry(req.file.path);
        if(!imageUrl)  return errorResponse(res, "Image not uploaded on cludinary");

        const post = await Post.create({ userId, title, content, image:imageUrl.url , status })
        if (!post) return errorResponse(res, "Error while creating post");

        return successResponse({ res, message: "Post created successfully", data: post });
    } catch (error) {
        return catchResponse(res, "Error occurred in creating post", error);
    }
}

const getAllPosts = async (req, res)=>{
    try {
        const posts = await Post.find({status: true})
        if(!posts) return errorResponse(res, "Error while getting posts");

        if(posts.length == 0) return errorResponse(res, "No post found");
        
        return successResponse({ res, message: "Posts get successfully", data: posts });
    } catch (error) {
        return catchResponse(res, "Error occurred in get posts", error);
    }
} 

const getAllPostsOfUser = async (req, res)=>{
    try {
        const userId = req.user._id
        const posts = await Post.find({status: true, userId})
        if(!posts) return errorResponse(res, "Error while getting posts");

        if(posts.length == 0) return errorResponse(res, "No post found");
        
        return successResponse({ res, message: "Posts get successfully", data: posts });
    } catch (error) {
        return catchResponse(res, "Error occurred in get posts", error);
    }
} 

export {
    createPost,
    getAllPosts,
    getAllPostsOfUser
}