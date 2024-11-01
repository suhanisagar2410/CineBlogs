import mongoose from "mongoose"
export const connect = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        .then(()=> console.log("MongoDB CONNCTED..."))
    } catch (error) {
        console.log("MongoDB NOT CONNCTED", error)
    }
}