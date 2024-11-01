import { createUser} from "../controllers/user.controller.js"
import { Router } from "express";
const userRouter = Router()

userRouter.route("/create").post(createUser)


export default userRouter