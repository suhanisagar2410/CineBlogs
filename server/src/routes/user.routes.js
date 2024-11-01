import { createUser, login} from "../controllers/user.controller.js"
import { Router } from "express";
const userRouter = Router()

userRouter.route("/create").post(createUser)
userRouter.route("/login").post(login)
export default userRouter