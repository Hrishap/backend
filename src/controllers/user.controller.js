import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { set } from "mongoose";
import jwt from "jsonwebtoken";



const getAccessandRefreshToken = async(userId) =>{
  try {
    const user = await User.findById(userId);
    if(!user) throw new ApiError(404, "User not found");
  
    const accessToken =  user.generateAccessToken();
    const refreshToken =  user.generateRefreshToken();
  
    //save refresh token in user document
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return {accessToken,refreshToken,user};
  } catch (error) {
    throw new ApiError(400,"Error while generating tokens " ,error);
  }
}

const registerUser = asyncHandler( async (req,res) =>{
      const {fullName,email,username,password } = req.body;
      if(
        [fullName,email,username,password].some((field) =>field.trim() === "")
      ){
        throw new ApiError(400, "All fields are required");
      }

      //check whether user already exists
      const existingUser = await User.findOne({
        $or : [{email},{username}]
      })
      if(existingUser){
        throw new ApiError(409, "User already exists with this email or username");
      }

      //take avatar and cover image from request
      const avatarLocalpath = req.files?.avatar[0]?.path;
        let coverImageLocalpath;
        if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
          coverImageLocalpath = req.files.coverImage[0].path;
        }
        console.log("Avatar req.files:", req.files);
        //check for avatar
        if(!avatarLocalpath) throw new ApiError(400, "Avatar is required");
        //check for cover image
        if(!coverImageLocalpath) coverImageLocalpath="";

        //upload avatar and cover image to cloudinary
        const avatar = await uploadOnCloudinary(avatarLocalpath);
        let coverImage ;
        if(coverImageLocalpath) {
          coverImage = await uploadOnCloudinary(coverImageLocalpath);
        }
        //create user
        const user = await User.create({
            fullName,
            avatar:avatar.url,
            coverImage: coverImage ? coverImage.url : "",
            email,
            password,
            username
        })
        const createdUser = await User.findById(user._id).select("-password -refreshToken");
        if(!createdUser){
            throw new ApiError(500, "User creation failed");
        }
        return res.status(201).json(
            new ApiResponse(201,"User registered succesfully", createdUser)
        )
    })

 const loginUser = asyncHandler(async(req,res) =>{

  const { userName,email,password} = req.body;

  if(!userName && !email) throw new ApiError(401,"Invalid user credentials");

  const user = await User.findOne({
    $or: [{email}, {username: userName}]
  });
  if(!user) throw new ApiError(404,"User not found");

  const isPasswordValid = await user.isPasswordCorrect(password);

  if(!isPasswordValid) throw new ApiError(401,"Invalid password");

  const {accessToken,refreshToken} = await getAccessandRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  if(!loggedInUser) throw new ApiError(500, "Login failed");

  const options = {
    httpOnly:true,
    secure:true
  }

  return res.status(200)
  .cookie("refreshToken",refreshToken,options)
  .cookie("accessToken",accessToken,options)
  .json(
    new ApiResponse(200,"User Logged in successfully",{
      user:loggedInUser,accessToken,refreshToken
    })
  );


 })

 const logoutUser = asyncHandler(async(req,res) =>{
    await User.findByIdAndUpdate(req.user._id,{
      $set :{
        accessToken : undefined
      }
    },
    {
      new:true
    })

    const options = {
    httpOnly:true,
    secure:true
  }

return res.status(200).
clearCookie("accessToken",options)
.clearCookie("refreshToken",options)
.json(new ApiResponse(200,"User logout",{}));

 })

 const refreshAccessToken = asyncHandler(async(req,res)=>{

   const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

   if(!incomingRefreshToken) throw new ApiError(401,"Error while accessing refresh token")

    const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded._id).select("-password -refreshToken");
    if(!user) throw new ApiError(404,"User not found");

      if(user.refreshToken !== incomingRefreshToken) {
        throw new ApiError(401,"Invalid refresh token");
      }
    const {accessToken,newRefreshToken} = await getAccessandRefreshToken(user._id);

    const options = {
      httpOnly:true,
      secure:true
    }
    return res.status(200)
    .cookie("refreshToken",newRefreshToken,options)
    .cookie("accessToken",accessToken,options)
    .json(new ApiResponse(200,"Access token refreshed successfully",{accessToken,newRefreshToken}))
    
 })
export { registerUser,loginUser,logoutUser,refreshAccessToken };