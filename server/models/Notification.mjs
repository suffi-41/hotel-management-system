import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    // Recipient details (guest, receptionist or admin)
    recipient: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: 'recipient.userType' // Dynamic reference based on userType
        },
        userType: {
            type: String,
            required: true,
            enum: ['Guest', 'Reciptionist', 'Manager'] // User role
        }
    },

    // Notification content
    message: {
        title: {
            type: String,
            required: true,
            trim: true
        },
        content: {
            type: String,
            required: true,
            trim: true
        }
    },

    // Notification metadata
    type: {
        type: String,
        required: true,
        enum: [
            'booking',
            'checkin',
            'checkout',
            'maintenance',
            'checkedIn',
            'checkedOut',
            'payment',
            'alert',
            'cancellation',
            'guest-checkin',
            'guest-checkout',
            'contact',
        ]
    },
    status: {
        type: String,
        enum: ['unread', 'read', 'archived'],
        default: 'unread'
    },
    metadata: {
        // Additional context (e.g., room number, reservation ID)
        roomNumber: String,
        bookingId: mongoose.Schema.Types.ObjectId,
    },

    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date,
    //expiresAt: Date // Optional: Auto-delete notifications after a period
});

// Indexes for faster queries
notificationSchema.index({ 'recipient.userId': 1, status: 1 });
notificationSchema.index({ createdAt: -1 });

// Soft delete (optional)
notificationSchema.add({ isDeleted: { type: Boolean, default: false } });

// Middleware to update 'updatedAt' on save
notificationSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});
const Notification = mongoose.model('Notification', notificationSchema);
export default Notification