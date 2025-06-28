import mongoose from "mongoose";
import colors from'colors';

import "dotenv/config"
export const connectDB = async()=>{
    try {
   await mongoose.connect(process.env.MONGO_URL)
    console.log("Mongodb Connected Succesfully".green.inverse)
    } catch (err) {
        console.log("error occured" + err)
    }
}