import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";

export const verifyJWT = asyncHandler(async(req,res,next) =>{
   try {
     const token = req.cookies?.accessToken || req.headers.authorization?.replace("Bearer ","");
 
     if(!token){
         throw new ApiError(401,"Access token is required");
     }
 
     const decoded = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    const user =  await User.findById(decoded?._id).select("-password -refreshToken")
    if(!user){
     throw new ApiError(401,"No user found");
    }
 
    req.user = user;
    next()
   } catch (error) {
        throw new ApiError(404,"Something went wrong while accessing token",error?.message)
   }
})