import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async ()=>{
    try{
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: DB_NAME,
        });
        console.log(connectionInstance.connection.host);
        console.log("Connected to database successfully");
    }
    catch(error){
        console.log("Error while connecting with database",error);
        process.exit(1);
    }
}


export { connectDB };