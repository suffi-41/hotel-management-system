import JWT from 'jsonwebtoken';
import mail from "../config/_mail.mjs";
import { hashPassword, comparePassword, otpGen, htmlContentForTop } from "../config/util.mjs";
import uploadFileInCloudinary from "../config/cloudUploaded.mjs";
import User from '../models/User.mjs';


export const userRegistration = async (req, res) => {
    try {
        const { firstname, lastname, email, password, phone } = await req.body;
        const name = firstname + " " + lastname;
        const emailId = await User.findOne({ email: email });
        if (emailId) {
            return res.status(400).json({ status: false, message: "Email already exits" })
        }
        const user = await User.findOne({ phoneNumber: phone });
        if (user) {
            return res.status(400).json({ status: false, message: "Phone number already exits" });
        }
        const hash_Password = await hashPassword(password);
        const newUser = new User({
            name,
            email,
            password: hash_Password,
            phoneNumber: phone
        });
        const result = await newUser.save();
        result ? res.status(200).json({ status: true, message: "User registered successfully", id: result._id, email: result.email }) : res.status(400).json({ status: false, message: "User registration failed" });
    } catch (error) {
        console.log(error)
        return res.status(401).json({ status: false, message: "Internal server error" })
    }
}

// Login
export const phoneNumber = async (req, res) => {
    try {
        const { phone } = req.body;
        const user = await User.findOne({ phoneNumber: phone }, { name: 1, avature: 1, email: 1 });
        console.log(user)
        if (user) {
            return res.status(200).json({ status: true, message: "Enter you password", data: { avature: user.avature, id: user._id, email: user.email } });
        } else {
            return res.status(401).json({ status: false, message: "Invalid crandential" });
        }
    } catch (error) {
        console.log(error)
        return res.status(401).json({ status: false, message: "Internal server error" })
    }
}

// send one time password on user email 
export const send_otp = async (req, res) => {
    try {
        const { id } = req?.params;
        const user = await User.findById(id, { email: 1 });
        const otp = await otpGen();
        user.otp = otp;
        const digits = otp.split("");
        const subject = "Verify your account";
        const htmlContent = htmlContentForTop(digits);
        if (await user.save()) {
            mail(user?.email, subject, htmlContent);
            return res.status(200).json({ status: true, message: "Otp send successfully" });
        }
        return res.status(400).json({ status: false, message: "Otp send failed" });
    } catch (error) {
        console.log(error)
        return res.status(401).json({ status: false, message: "Internal server error" })
    }
}

export const passowrd_verify = async (req, res) => {
    try {
        const { password, id } = req.body;
        const user = await User.findById(id, { password: 1 });
        if (user) {
            const isMatch = await comparePassword(password, user.password);
            if (isMatch) {
                return res.status(200).json({ status: true, message: "Verify your accound with otp", id: user._id });
            }
            return res.status(400).json({ status: false, message: "Wrong password, please try again" });
        } else {
            return res.status(400).json({ status: false, message: "Some errror ocupied" });
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({ status: false, message: "Internal server error" })
    }
}

export const verify_account = async (req, res) => {
    try {
        const { code, id } = await req.body;
        const user = await User.findOne({ _id: id, otp: code });
        if (user) {
            user.otp = null;
            if (await user.save()) {
                //create token
                const payload = {
                    id: user._id,
                    email: user.email,
                    phone: user.phoneNumber
                }
                const token = JWT.sign(payload, process.env.SECRET_KEY);
                return res.status(200).json({ status: true, "message": "Account verified successfully", token });
            } else {
                return res.status(400).json({ status: false, "message": "Invalid verification code" });
            }
        }
        else {
            return res.status(400).json({ status: false, "message": "Invalid OTP" });
        }
    } catch (error) {
        console.log(error)
        return res.status(401).json({ status: false, message: "Internal server error" })
    }
}

//Reset password 
export const reset_password = async (req, res) => {
    try {
        const { password, id } = await req?.body;
        const hash_Password = await hashPassword(password);
        const user = await User.findByIdAndUpdate(id, { password: hash_Password }, { new: true });
        if (user) {
            return res.status(200).json({ status: true, message: "Password reset successfully" });
        } else {
            return res.status(400).json({ status: false, message: "Some error ocupied" });
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({ status: false, message: "Internal server error" })
    }
}


// update name
export const editName = async (req, res) => {
    try {
        const id = await req._id;
        const { name } = await req.body;
        const user = await User.findByIdAndUpdate(id, { name: name }, { new: true });
        if (user) {
            res.status(200).json({ status: true, message: "Name updated successfully" });
        } else {
            res.status(400).json({ status: false, message: "Some error ocupied" });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: "Some error ocupied" });
    }
}

//update phone
export const editPhone = async (req, res) => {
    try {
        const id = await req._id;
        const { phone } = await req.body;
        const user = await User.findByIdAndUpdate(id, { phoneNumber: phone }, { new: true });
        if (user) {
            res.status(200).json({ status: true, message: "Phone number updated successfully" });
        } else {
            res.status(400).json({ status: false, message: "Some error ocupied" });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: "Some error ocupied" });
    }
}

// update date of birth
export const editDateOfBirth = async (req, res) => {
    try {
        const id = await req._id;
        const { dataOfBirth } = await req.body;
        const user = await User.findByIdAndUpdate(id, { dateOfBirth: dataOfBirth }, { new: true });
        if (user) {
            res.status(200).json({ status: true, message: "Date of birth updated successfully" });
        } else {
            res.status(400).json({ status: false, message: "Some error ocupied" });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: "Some error ocupied" });
    }
}

// update gender
export const editGender = async (req, res) => {
    try {
        const id = await req._id;
        const { gender } = await req.body;
        const user = await User.findByIdAndUpdate(id, { gender: gender }, { new: true });
        if (user) {
            res.status(200).json({ status: true, message: "Gender updated successfully" });
        } else {
            res.status(400).json({ status: false, message: "Some error ocupied" });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: "Some error ocupied" });
    }
}

// update address
export const editAddress = async (req, res) => {
    try {
        const id = await req._id;
        const { address } = await req.body;
        const user = await User.findByIdAndUpdate(id, { address: address }, { new: true });
        if (user) {
            res.status(200).json({ status: true, message: "Address updated successfully" });
        } else {
            res.status(400).json({ status: false, message: "Some error ocupied" });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: "Some error ocupied" });
    }
}

// change password
export const changePassword = async (req, res) => {
    try {
        const id = await req._id;
        const { currentPassword, newPassword } = await req.body;
        const user = await User.findById(id);

        if (user) {
            const isMatch = await comparePassword(currentPassword, user.password);

            if (isMatch) {
                const hash_Password = await hashPassword(newPassword);
                const user = await User.findByIdAndUpdate(id, { password: hash_Password }, { new: true });
                if (user) {
                    res.status(200).json({ status: true, message: "Password updated successfully" });
                } else {
                    res.status(400).json({ status: false, message: "Some error ocupied" });
                }
            } else {
                res.status(400).json({ status: false, message: "Current password is incorrect" });
            }
        } else {
            res.status(400).json({ status: false, message: "Some error ocupied" });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: "Some error ocupied" });
    }
}

//get user data
export const getUserData = async (req, res) => {
    try {
        const id = await req._id;
        const user = await User.findById(id, { password: 0, otp: 0 });
        if (user) {
            res.status(200).json({ status: true, UserData: user });
        } else {
            res.status(400).json({ status: false, message: "Some error ocupied" });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: "Some error ocupied" });
    }
}

// get user find by id 
export const getUserById = async (req, res) => {
    try {
        const id = await req?.params?.id;
        const user = await User.findById(id, { password: 0, otp: 0 });
        if (user) {
            res.status(200).json({ status: true, user: user });
        } else {
            res.status(400).json({ status: false, message: "user not found!" });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: "Some error ocupied" });
    }
}

export const uploadProilePic = async (req, res) => {
    try {
        const file = req.file;
        const id = await req._id;
        if (!file) {
            return res.status(400).json({ status: false, message: "Some error occupied!" });
        }
        const secure_url = await uploadFileInCloudinary(file.path);
        if (secure_url) {
            const user = await User.findByIdAndUpdate(id, { avature: secure_url }, { new: true });
            if (user) {
                res.status(200).json({ status: true, message: "Profile picture uploaded successfully", avature: secure_url });
            } else {
                res.status(400).json({ status: false, message: "Some error ocupied" });
            }
        } else {
            res.status(400).json({ status: false, message: "Some error ocupied" });
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, message: "Some error ocupied" });
    }
}

export const getUserAvature = async (req, res) => {
    try {
        const id = await req._id
        const user = await User.findById(id, { avature: 1, _id: 1 })
        if (user) {
            return res.status(200).json({ status: true, avature: user.avature, id:user._id });
        } else {
            return res.status(400).json({ status: false, message: "some error occupeid" });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: "Some error ocupied" });
    }
}

export const blockedAndUnblockedUser = async (req, res) => {
    try {
        const id = await req?.params?.id;
        const user = await User.findById(id, { isBlocked: 1, });
        if (!user) {
            return res.status(400).json({ status: false, message: "User not found" });
        }
        if (user.isBlocked) {
            user.isBlocked = false;
            if (await user.save()) {
                return res.status(200).json({ status: true, message: "User unblocked successfully" });
            }
        }
        else {
            user.isBlocked = true;
            if (await user.save()) {
                return res.status(200).json({ status: true, message: "User blocked successfully" });
            }
        }
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({ status: false, message: "Internal server error, please try again leter!" })
    }
}

// admin 

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password -otp");
        if (users) {
            return res.status(200).json({ status: true, users });
        }
        return res.status(400).json({ status: false, message: "No employees found" });

    } catch (error) {
        console.log(error)
        return res.status(401).json({ status: false, message: "Internal server error, please try again leter!" })
    }
}


// get all curent guest , which users are actived 

