import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()
export const mongoConnection = async () => {
    const uri = process.env.MONGO_URI;
    console.log(uri)
    if (!uri) {
        console.log('MONGO_URI not found')
        process.exit(1);
    }
    try {
        await mongoose.connect(uri)
        console.log('connected to mongo')
    } catch (e) {
        console.log(e)
        process.exit(1);
    }
}
