import express from "express";
import multer from "multer"
import { fetchUser } from "../middleware/fetchUser.mjs"
import rateLimit from 'express-rate-limit';

const verifyAccountLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { status: false, message: "Too many attempts, please try again later." }
});


const storage = multer.diskStorage({});
const uploader = multer({ storage: storage });
const router = express.Router();
import {
    userRegistration,
    passowrd_verify,
    phoneNumber,
    verify_account,
    send_otp,
    reset_password,
    editName,
    editAddress,
    editDateOfBirth,
    editPhone,
    editGender,
    changePassword,
    getUserById,
    getUserData,
    uploadProilePic,
    getUserAvature,
    blockedAndUnblockedUser,
    //admin
    getAllUsers,
} from "../controllers/user.mjs";

//routing user registration 
router.route("/register").post(userRegistration);

//routing phone number
router.route("/login").post(phoneNumber);

//routing password verify
router.route("/password").post(passowrd_verify);

//routing verify account
router.route("/verify").post(verifyAccountLimiter, verify_account);

router.route("/sendOtp/:id").post(send_otp);

// routing reset password
router.route("/reset-password").put(reset_password);


// routing edit name
router.route("/edit-name").put(fetchUser, editName);

// routing edit address
router.route("/edit-address").put(fetchUser, editAddress);

// routing edit date of birth
router.route("/edit-date-of-birth").put(fetchUser, editDateOfBirth);

// routing edit phone
router.route("/edit-phone").put(fetchUser, editPhone);

// routing edit gender
router.route("/edit-gender").put(fetchUser, editGender);

// routing change password
router.route("/change-password").put(fetchUser, changePassword);

// get user profile
router.route("/get-user-profile").get(fetchUser, getUserData);



//
router.route("/upload-profile-pic").put(uploader.single("image"), fetchUser, uploadProilePic);

//get user avature
router.route("/get-user-avature").get(fetchUser, getUserAvature);
//block user
router.route("/block-unblock-user/:id").put(blockedAndUnblockedUser);

//admin access router 
router.route("/get-all-users").get(getAllUsers);

// get user by id
router.route("/get-user-by-id/:id").get(getUserById);

//get current guest for amdin panel






export default router;

