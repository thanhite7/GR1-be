import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function connectDB() {
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB");
    }catch(err){
        throw new Error("Error connecting to MongoDB");
    }
}

async function disconnectDB() {
    try{
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }catch(err){
        throw new Error("Error disconnecting from MongoDB");
    }
}

export {connectDB, disconnectDB};