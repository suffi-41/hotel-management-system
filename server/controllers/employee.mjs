import Employees from "../models/Employees.mjs";
import { hashPassword, comparePassword, otpGen, htmlContentForTop } from "../config/util.mjs";
import generateUniqueId from "generate-unique-id";
import mail from "../config/_mail.mjs";
import JWT from "jsonwebtoken";
import uploadFileInCloudinary from "../config/cloudUploaded.mjs";



export const otpSender = async (req, res) => {
    try {
        const { id } = req?.params;
        const employee = await Employees.findById(id, { email: 1 });
        if (!employee) {
            return res.status(404).json({ status: false, message: "Employee not found" });
        }
        const otp = await otpGen();
        employee.otp = otp;
        const digits = otp.split("")
        const htmlContent = htmlContentForTop(digits);
        if (await employee.save()) {
            mail(employee?.email, "OTP Verification", htmlContent);
            return res.status(200).json({ status: true, message: "OTP sent successfully" });
        }
        return res.status(400).json({ status: false, message: "OTP not sent" });

    } catch (error) {
        console.log(error)
        return res.json({ status: false, message: "Internal server error, please try again leter!" })
    }
}

export const verification = async (req, res) => {
    try {
        const { otp } = await req.body;
        const { id } = req.params;
        const employee = await Employees.findById(id, { otp: 1 });

        if (employee.otp === otp) {
            employee.otp = null;
        }

        if (await employee.save()) {
            return res.status(200).json({ status: true, message: "Account verified successfully" });
        }
        return res.status(400).json({ status: false, message: "Account not verified" });
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({ status: false, message: "Internal server error, please try again leter!" })
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { password } = await req?.body;
        const { id } = await req?.params

        const employee = await Employees.findByIdAndUpdate(id, {
            password: await hashPassword(password)
        }, {
            new: true
        })
        if (employee) {
            return res.status(200).json({ status: true, message: "Password reset successfully" })
        }
        return res.status(400).json({ status: false, message: "Password not reset" })

    } catch (errro) {
        console.log(error)
        return res.status(401).json({ status: false, message: "Internal server error, please try again leter!" })
    }
}

export const addEmployee = async (req, res) => {
    const {
        fullName,
        email,
        mobile,
        gender,
        dob,
        role,
        shift,
        salary,
        address,
    } = await req.body;

    try {
        // Check if employee already exists
        const existingEmployee = await Employees.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ status: false, message: "Employee already exists" });
        }

        // Check manager and receptionist limits
        if (role === "Manager") {
            const managerCount = await Employees.countDocuments({ status: false, role: "Manager" }, { isBlocked: false })
            if (managerCount >= 2) {
                return res.status(400).json({ status: false, message: "Maximum number of managers reached" });
            }
        }

        if (role === "receptionist") {
            const receptionistCount = await Employees.countDocuments({ role: "Receptionist" }, { isBlocked: false });
            if (receptionistCount >= 3) {
                return res.status(400).json({ status: false, message: "Maximum number of receptionists reached" });
            }
        }
        const employeeId = generateUniqueId({
            length: 10,
            useNumbers: true,
            useLetters: false
        });
        const password = generateUniqueId({
            length: 10,
            numbers: true,
            symbols: false,
            uppercase: true,
            strict: true
        })
        console.log(password)
        // Hash the password
        const hashedPassword = await hashPassword(password);

        // Create new employee
        const newEmployee = new Employees({
            employeeId,
            name: fullName,
            email,
            password: hashedPassword,
            phoneNumber: mobile,
            gender,
            dateOfBirth: dob,
            role,
            shift,
            salary,
            address,
        });

        const result = await newEmployee.save();
        if (!result) {
            return res.status(400).json({ status: false, message: "Detials is not added, please ary agian!" });
        }
        return res.status(200).json({ status: true, message: "Employee added successfully", _id: result._id, });
    } catch (error) {
        console.log(error)
        return res.status(401).json({ status: false, message: "Internal server error, please try again leter!" })
    }
}

export const employeeCradentialVerify = async (req, res) => {
    try {
        const { cradentical } = await req?.body;
        const employee = await Employees.findOne({
            $or: [
                { email: cradentical },
                { phoneNumber: cradentical },
                { employeeId: cradentical }
            ]
        }, { _id: 1, role: 1, isLogged: 1, isBlocked: 1, email: 1 });
        if (!employee) {
            return res.status(400).json({ status: false, message: "Invalid credential" })
        }
        if (employee.role === "Manager" && employee.isLogged) {
            return res.status(400).json({ status: false, message: "You are already logged in" })
        }
        if (employee.isBlocked) {
            return res.status(400).json({ status: false, message: "Your account is blocked" })
        }
        return res.status(200).json({ status: true, message: "Please  verify password also", data: { id: employee._id, email: employee.email } })

    } catch (error) {
        console.log(error)
        return res.status(401).json({ status: false, message: "Internal server error, please try again leter!" })
    }
}

// employess password verified function 
export const passowrd_verify = async (req, res) => {
    try {
        const { password, id } = await req.body;
        const employee = await Employees.findById(id, { password: 1 });
        if (employee) {
            const isMatch = await comparePassword(password, employee.password);

            if (isMatch) {
                const payload = {
                    id: employee._id,
                    email: employee.email,
                    phone: employee.phoneNumber,
                    employeeId: employee.employeeId
                }
                const token = JWT.sign(payload, process.env.SECRET_KEY);
                res.status(200).json({ status: true, message: "Accound is verified suceesufully", token });
            }
            res.status(400).json({ status: false, message: "Wrong password, please try again" });
        } else {
            res.status(400).json({ status: false, message: "Some errror ocupied" });
        }
    } catch (error) {
        console.log(error);
    }
}

export const getEmployeesAvatureAndId = async (req, res) => {
    try {
        const id = req?._id;
        const employee = await Employees.findById(id, { avature: 1, id: 1 })
        return res.status(200).json({
            status: true,
            avature: employee?.avature,
            id: employee?._id

        })
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            status: false,
            message: "Some error occupied!"
        })
    }
}



export const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employees.find({ isActive: true }, { password: 0 })
        if (employees) {
            return res.status(200).json({ status: true, employees });
        }
        return res.status(400).json({ status: false, message: "No employees found" });

    } catch (error) {
        console.log(error)
        return res.status(401).json({ status: false, message: "Internal server error, please try again leter!" })
    }
}

export const inActivatedEmployees = async (req, res) => {
    try {
        const inActiveEmployees = await Employees.find({ isActive: false }, { password: 0 })
        if (inActiveEmployees) {
            return res.status(200).json({ status: true, inActiveEmployees })
        }
        return res.status(400).json({ status: false, message: "No inactive employees found" })
    } catch (error) {
        console.log(error);
        return res.status(401).json({ status: false, message: "Internal server error, please try again leter!" })

    }
}
// Update employee detials function
export const updateEmployeeDetials = async (req, res) => {
    try {
        const { id } = await req.params;
        const {
            name,
            phoneNumber,
            gender,
            dob,
            role,
            shift,
            salary,
            address
        } = req.body;
        console.log(req)
        const employee = await Employees.findByIdAndUpdate(id, {
            $set: {
                name,
                phoneNumber,
                gender,
                dateOfBirth: dob,
                role,
                shift,
                salary,
                address
            }
        }, { new: true });
        if (employee) {
            return res.status(200).json({ status: true, message: "Employee details updated successfully", employee });
        }
        return res.status(400).json({ status: false, message: "Employee details not updated" });
    } catch (error) {
        console.log(error)
        return res.status(401).json({ status: false, message: "Internal server error, please try again leter!" })
    }
}
// Inavtive employee function
export const inActivatedEmployee = async (req, res) => {
    try {
        const id = req?.params?.id;
        console.log(id)
        const employee = await Employees.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (employee) {
            return res.status(200).json({ status: true, message: "Employee inactivated successfully" });
        }
        return res.status(400).json({ status: false, message: "Employee not inactivated" });

    } catch (error) {
        console.log(error)
        return res.status(401).json({ status: false, message: "Internal server error, please try again leter!" })
    }
}

//Get one Employees detials function using  id
export const getEmplyeeDetials = async (req, res) => {
    try {
        const { id } = req?.params;
        const employee = await Employees.findById(id, { password: 0 });
        if (!employee) {
            return res.status(400).json({ status: false, message: "Employee not found" });
        }
        return res.status(200).json({ status: true, employee });
    } catch (error) {
        console.log(error);
        return res.status(401).json({ status: false, message: "Internal server error, please try again leter!" });
    }
}

//get one employee data with token 
export const getEmployeedetailsWithToken = async (req, res) => {
    try {
        const id = req._id;
        const employee = await Employees.findById(id, {
            password: 0,
            otp: 0,
            __v: 0,
            isLogged: 0

        });
        if (!employee) {
            return res.status(400).json({ status: false, message: "Employee not found" });
        }
        return res.status(200).json({ status: true, employee });


    } catch (error) {
        console.log(error);
        return res.status(401).json({ status: false, message: "Internal server error, please try again leter!" });

    }

}

export const updateEmployeeDetialsWithToken = async (req, res) => {
    try {
        const id = req._id;
        const {
            name,
            phoneNumber,
            gender,
            dateOfBirth,
            role,
            shift,
            salary,
            address
        } = req.body;
        const employee = await Employees.findByIdAndUpdate(id, {
            $set: {
                name,
                phoneNumber,
                gender,
                dateOfBirth,
                role,
                shift,
                salary,
                address
            }
        })
        if (employee) {
            return res.status(200).json({ status: true, message: "Employee details updated successfully", employee });
        }
        return res.status(400).json({ status: false, message: "Employee details not updated" });
    }
    catch (error) {
        console.log(error)
        return res.status(401).json({ status: false, message: "Internal server error, please try again leter!" })
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
            const emp = await Employees.findByIdAndUpdate(id, { avature: secure_url }, { new: true });
            if (emp) {
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







