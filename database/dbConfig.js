import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Database connected Successfully");
    }catch(error){
        console.log("Failed to Connect the DB", error);
    }
}

export default connectDB;