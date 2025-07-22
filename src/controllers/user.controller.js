import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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
export { registerUser };