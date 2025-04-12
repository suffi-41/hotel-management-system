import mongoose from "mongoose";
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true,
        trim: true,
        enum: [
            'Reservation Inquiry',
            'Special Requests',
            'Feedback/Complaint',
            'Event Inquiry',
            'Emergency Contact',
            'General Inquiry'
        ]
    },
    message: {
        type: String,
        required: true,
        trim: true,
    }
}, {
    timestamps: true
});
const Contact = mongoose.model("Contact", contactSchema);
export default Contact