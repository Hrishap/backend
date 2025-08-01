import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";


const app = express();

app.on("error",(err)=>{
    console.error("Express error:", err);
    throw err
})

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

//import router
import { router } from "./routes/user.route.js";
app.use("/api/v1/users",router)
export {app}