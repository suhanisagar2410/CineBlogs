import Joi from "joi"
import { Post } from "../models/post.model.js"
import { errorResponse, successResponse, catchResponse, uploadOnCloudinry } from "../utils/functions.js"
import { User } from "../models/user.model.js"
import mongoose from "mongoose"

const postValidation = Joi.object({
    userId: Joi.string().required(),
    title: Joi.string().required(),
    content: Joi.string().min(5).required(),
    status: Joi.boolean().required(),
    image: Joi.string().required(),
})
const createPost = async (req, res) => {
  
    try {
        const { error } = postValidation.validate(req.body)
        if (error) return errorResponse(res, error.message);
        const { userId, title, content, status, image } = req.body;

        if(userId != req.user._id) return errorResponse(res, "User is not the same");

        const user = await User.findOne({_id: userId});
        if (!user) return errorResponse(res, "User not found");

        const post = await Post.create({ userId, title, content, image , status })
        if (!post) return errorResponse(res, "Error while creating post");

        return successResponse({ res, message: "Post created successfully", data: post });
    } catch (error) {
        return catchResponse(res, "Error occurred in creating post", error);
    }
}

const postUpdateValidation = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().min(5).required(),
  status: Joi.boolean().required()
})

const updatePost = async (req, res) => {
  
  try {
      const { error } = postUpdateValidation.validate(req.body)
      if (error) return errorResponse(res, error.message);
      const { title, content, status } = req.body;
      const post = await Post.findOneAndUpdate(
          { _id: req.params.postId, userId: req.user._id },
          { title, content, status },
          { new: true }
      );
      if (!post) return errorResponse(res, "Post not found or user not authorized");

      return successResponse({ res, message: "Post updated successfully", data: post });
  } catch (error) {
      return catchResponse(res, "Error occurred while updating post", error);
  }
}


const getAllPostsOfUser = async (req, res)=>{
    try {
        const userId = req.user._id
        const posts = await Post.find({userId})
        if(!posts) return errorResponse(res, "Error while getting posts");

        if(posts.length == 0) return errorResponse(res, "No post found");
        
        return successResponse({ res, message: "Posts get successfully", data: posts });
    } catch (error) {
        return catchResponse(res, "Error occurred in get posts", error);
    }
}

const getPostById = async (req, res) => {
  
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate('userId', 'username email');
    if (!post) {
      return errorResponse(res, "Post not found");
    }

    return successResponse({ res, message: "Post found successfully", data: post });

  } catch (error) {
    return catchResponse(res, "Error occurred while fetching post by ID", error.message);
  }
};

const getAllPosts = async (req, res) => {
    try {
      const category = req.query.category;
      const limit = req.query.limit;
      const page = req.query.page;
      const search = req.query.search;
      const regex = new RegExp(search, "i");
      const filters = {
         status: true 
      };
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

const deletePost = async (req, res) => {
    try {
        const post = await Post.findOneAndDelete({ _id: req.params.postId, userId: req.user._id });
        if (!post) return errorResponse(res, "Post not found or user not authorized");

        return successResponse({ res, message: "Post deleted successfully", data: {} });
    } catch (error) {
        return catchResponse(res, "Error occurred while deleting post", error);
    }
}

const addLike = async (req, res)=>{
    try {
        const postId = req.params.postId
        const user = req.user
        if(!mongoose.isValidObjectId(postId)){
            return errorResponse(res, "Invalid post id")
        }

        const dislikeExists = await Post.findOne({
          _id: postId,
          dislikes: {
            $elemMatch: {
              userId: user._id,
            },
          },
        });
    
        if(dislikeExists){
          await Post.updateOne(
            { _id: postId },
            {
              $pull: {
                dislikes: { userId: user._id },
              },
            }
          );
        }

        const likeExists = await Post.findOne({
          _id: postId,
          likes: {
            $elemMatch: {
              userId: user._id,
            },
          },
        });

        if(likeExists){
          await Post.updateOne(
            { _id: postId },
            {
              $pull: {
                likes: { userId: user._id },
              },
            }
          );
          return successResponse({ res, message: "Like deleted successfully", data: {} });
        }
        else{
          const updatedPost = await Post.updateOne({_id: postId},{
            $push: {
              likes: {
                userId: user._id,
                profileImage: user.profileImage,
                email: user.email,
                username: user.username
              }
            }
          })
          
      if(updatedPost.modifiedCount !== 1){
        return errorResponse(res, "Post not liked")
      }
      return successResponse({ res, message: "Liked", data: {} });
    }

    } catch (error) {
      console.log(error)
      return catchResponse(res, "Error occurred in like", error);
    }
}

const addDislike = async (req, res)=>{
  try {
    const postId = req.params.postId
    const user = req.user
    if(!mongoose.isValidObjectId(postId)){
        return errorResponse(res, "Invalid post id")
    }

    const likeExists = await Post.findOne({
      _id: postId,
      likes: {
        $elemMatch: {
          userId: user._id,
        },
      },
    });

    if(likeExists){
      await Post.updateOne(
        { _id: postId },
        {
          $pull: {
            likes: { userId: user._id },
          },
        }
      )}

    const dislikeExists = await Post.findOne({
      _id: postId,
      dislikes: {
        $elemMatch: {
          userId: user._id,
        },
      },
    });

    if(dislikeExists){
      await Post.updateOne(
        { _id: postId },
        {
          $pull: {
            dislikes: { userId: user._id },
          },
        }
      );
      return successResponse({ res, message: "Dislike deleted successfully", data: {} });
    }
    else{
      const updatedPost = await Post.updateOne({_id: postId},{
        $push: {
          dislikes: {
            userId: user._id,
            profileImage: user.profileImage,
            email: user.email,
            username: user.username
          }
        }
      })
      
  if(updatedPost.modifiedCount !== 1){
    return errorResponse(res, "Post not disliked")
  }
  return successResponse({ res, message: "Disliked", data: {} });
}

} catch (error) {
  console.log(error)
  return catchResponse(res, "Error occurred in disliked", error);
}
}

export {
    createPost,
    getAllPosts,
    getAllPostsOfUser,
    updatePost,
    deletePost,
    getPostById,
    addLike,
    addDislike
}