import express from "express"
import { configDotenv } from "dotenv"
import { connect } from "./src/database/db.js"
configDotenv()
const app = express()

app.listen(process.env.PORT, ()=> console.log(`App is running on ${process.env.PORT}`))
connect()   