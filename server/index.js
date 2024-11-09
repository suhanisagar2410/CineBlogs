import express from "express"
import { configDotenv } from "dotenv"
import { connect } from "./src/database/db.js"
import cors from "cors"
import userRouter from "./src/routes/user.routes.js"
import postRouter from "./src/routes/post.route.js"
import bodyParser from "body-parser"
configDotenv()
export const app = express()

app.use(cors({  origin: process.env.CORS_ORIGIN, credentials:true }))
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({extended: true , limit: "16kb"}))
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes

app.listen(process.env.PORT, ()=> console.log(`App is running on ${process.env.PORT}`))
connect()

app.use("/api/v1/users", userRouter)
app.use("/api/v1/posts", postRouter)