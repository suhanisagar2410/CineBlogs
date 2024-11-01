import express from "express"
import { configDotenv } from "dotenv"
import { connect } from "./src/database/db.js"
import cors from "cors"
import userRouter from "./src/routes/user.routes.js"
configDotenv()
export const app = express()

app.use(cors({  origin: process.env.CORS_ORIGIN, credentials:true }))
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({extended: true , limit: "16kb"}))

app.listen(process.env.PORT, ()=> console.log(`App is running on ${process.env.PORT}`))
connect()

// Routes

app.use("/api/v1/users", userRouter)