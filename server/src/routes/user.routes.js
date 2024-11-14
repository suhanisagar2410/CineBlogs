import { createUser, getCurrentUser, getUserById, login, logOut} from "../controllers/user.controller.js"
import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const userRouter = Router()

userRouter.route("/create").post( upload.single('profileImage') ,createUser)
userRouter.route("/login").post(login)
userRouter.route("/logout").post(authenticateToken, logOut)
userRouter.route("/get-user/:id").get(authenticateToken, getUserById)
userRouter.route("/current-user").get( authenticateToken, getCurrentUser);                    
export default userRouter