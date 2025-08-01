import { Router } from "express";
import { changeUserPassword, loginUser, logoutUser, refreshAccessToken, registerUser,updateUserDetails } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"; // Import the multer middleware
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/register").post(
    upload.fields([
        {name : "avatar", maxCount: 1},
        {name : "coverImage", maxCount: 1}
    ])
    ,registerUser);
router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT,changeUserPassword);
router.route("/update-details").patch(verifyJWT,updateUserDetails);

export {router};