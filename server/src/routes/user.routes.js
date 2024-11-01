import { createUser, login, logOut} from "../controllers/user.controller.js"
import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
const userRouter = Router()

userRouter.route("/create").post(createUser)
userRouter.route("/login").post(login)
userRouter.route("/logout").post(authenticateToken, logOut)
export default userRouter