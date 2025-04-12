import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['single', 'double', 'suite', 'luxury', 'deluxe'],
        default: 'single'
    },
    status: {
        type: String,
        enum: ['available', 'occupied', 'maintenance', 'cleaning', 'inprogress'],
        default: 'available'
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User", // Reference to User model
                required: true,
            },
            rating: {
                type: Number,
                required: true,
                min: 1,
                max: 5,
            },
            comment: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        }
    ],
    amenities: {
        type: [String], // List of amenities (Wi-Fi, TV, etc.)
    },
    averageRating: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

roomSchema.methods.calculateAverageRating = function () {
    if (this.reviews.length === 0) {
        this.averageRating = 0;
    } else {
        const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
        this.averageRating = total / this.reviews.length;
    }
    return this.averageRating;
};

roomSchema.virtual('reviewCount').get(function () {
    return this.reviews.length;
});

const Room = mongoose.model('Room', roomSchema);
export default Room;