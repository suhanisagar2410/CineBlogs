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

const getAllPosts = async (req, res) => {
    try {
      const category = req.query.category;
      const limit = req.query.limit;
      const page = req.query.page;
      const search = req.query.search;
      const regex = new RegExp(search, "i");
      const filters = {};
      if (category) filters.category = category;
  
      if (search)
        filters.$or = [
          { title: { $regex: regex } },
          { category: { $regex: regex } }
        ];
  
      const postCount = (await Post.find(filters)).length;
  
      const posts = await Post.find(filters)
        .skip((page - 1) * limit)
        .limit(limit);
      if (!posts)
        return res.json({
          error: `Post Not Found By Filters`,
        });
  
      return res.status(200).json({ posts, postCount });
    } catch (error) {
      return res.json({
        error: `Error Occured While Fetching Data By Filters`,
      });
    }
  };

export {
    createPost,
    getAllPosts,
    getAllPostsOfUser
}