import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        default: 'Male'
    },
    dateOfBirth: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        default: null
    },
    onLeave: {
        type: Boolean,
        default: false
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    avature: {
        type: String,
        default: 'https://res.cloudinary.com/dbvotow1k/image/upload/v1742569234/p7xgtvaexc8qxo6dyjrw.jpg'
    },
    role: {
        type: String,
        enum: ['Manager', 'Maintenance', 'Receptionist', 'Security', 'Cleaner'],
        required: true
    },
    shift: {
        type: String,
        enum: ['Morning', 'Noon', 'Night']
    },
    isLogged: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    salary: {
        type: Number,
        required: true,
        min: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Employess = mongoose.model('Employess', employeeSchema);
export default Employess;
