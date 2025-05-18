import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const connectDB = () => {
    mongoose.connect(process.env.MONGO_URL).then(
        ()=>console.log("connected to Mongo"))
        .catch((e)=>console.log("error in connecting to DB" +e))
        
    
}

export default connectDB;