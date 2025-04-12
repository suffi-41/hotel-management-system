import mongoose from "mongoose";
const BookingSchema = new mongoose.Schema({
    guestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    guestName: {
        type: String,
        required: true
    },
    guestEmail: {
        type: String,
        required: true
    },
    guestPhone: {
        type: String,
        required: true
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true
    },
    numberOfGuests: {
        type: Number,
        required: true
    },
    checkInDate: {
        type: Date,
        required: true
    },
    checkOutDate: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["Cancelled", "Booked"],
        default: "Booked"
    },
    visitStatus: {
        type: String,
        enum: ["check-in", "in-room", "check-out"],
        default: "check-in"
    }
}, {
    timestamps: true
});

const Booking = mongoose.model("Booking", BookingSchema);
export default Booking;
