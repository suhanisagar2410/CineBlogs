import e, { Router } from "express"
import { authenticateToken } from "../middlewares/auth.middleware.js"
import { createPost, getAllPosts, getAllPostsOfUser } from "../controllers/post.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
const postRouter = Router()

postRouter.route("/create").post(authenticateToken, upload.single('image'), createPost)
postRouter.route("/get-posts").get(authenticateToken, getAllPosts)
postRouter.route("/get-userposts").get(authenticateToken, getAllPostsOfUser)

export default postRouter