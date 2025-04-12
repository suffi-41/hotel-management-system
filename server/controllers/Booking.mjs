import Room from "../models/Room.mjs";
import Booking from "../models/Booking.mjs";
import mongoose from "mongoose";
import mail from "../config/_mail.mjs";
import { Router } from "express";
import Notification from "../models/Notification.mjs";
import { checkedInNotification, checkedOutNotification } from "./realtimeupdateNotification.mjs"


const router = Router()

const now = new Date();
// Reset time to midnight UTC
now.setUTCHours(10, 0, 0, 0);
// Format as ISO 8601 with +00:00 offset
let today = now.toISOString().replace('Z', '+00:00');

const formateDateTenAM = (date) => {
    return new Date(new Date(date).setHours(10, 0, 0, 0))
}


const checkRoomAvailability = async (roomId, checkInDate, checkOutDate) => {
    const existingBooking = await Booking.findOne({
        roomId: roomId,
        $or: [
            // Check if the booking is within the requested dates
            { checkInDate: { $lt: checkOutDate }, checkOutDate: { $gt: checkInDate } },// Check if the booking is overlapping with the new booking
        ],
        status: { $ne: "Cancelled" } // Exclude cancelled bookings
    }, { reviews: 0 })
    return !existingBooking;
};

// find all available rooms based on check-in and check-out dates
export const getAvailableRooms = async (req, res) => {
    try {
        const { checkInDate, checkOutDate } = await req?.query;
        const checkIn = new Date(checkInDate).setHours(10, 0, 0, 0);
        const checkOut = new Date(checkOutDate).setHours(10, 0, 0, 0);

        if (isNaN(checkIn) || isNaN(checkOut)) {
            return res.status(400).json({ status: false, message: "Invalid dates provided!" });
        }

        const bookedRooms = await Booking.find({
            $or: [
                { checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } }
            ],
            status: { $ne: "Cancelled" } // Exclude cancelled bookings
        }).select("roomId");

        // Extract booked room IDs
        const bookedRoomIds = bookedRooms.map(booking => booking.roomId);
        // Find rooms that are available based on check-in and check-out dates
        const availableRooms = await Room.aggregate([
            {
                $match: {
                    _id: { $nin: bookedRoomIds.map(id => new mongoose.Types.ObjectId(id)) }
                }
            },
            {
                $addFields: {
                    reviewCount: { $size: "$reviews" } // Add review count field
                }
            },

        ]);
        //const availableRooms = await Room.find({ _id: { $nin: bookedRoomIds } }, { reviews: 0 });
        if (availableRooms.length > 0) {
            return res.status(200).json({ status: true, data: availableRooms })
        }
        return res.status(401).json({ status: true, message: "No rooms available" })

    } catch (error) {
        console.log(error);
        res.status(400).json({ status: false, message: "Some error occupied, please try again leter!" })
    }
};

// check room availability based on check-in and check-out dates


export const bookRoom = async (req, res) => {
    try {
        const guestId = await req._id;
        const { guestName, guestEmail, guestPhone, roomId, numberOfGuests, checkInDate, checkOutDate } = await req?.body;
        const isAvailable = await checkRoomAvailability(roomId, formateDateTenAM(checkInDate), formateDateTenAM(checkOutDate));
        if (!isAvailable) {
            return res.status(401).json({ status: true, message: "Room is not available for selected dates" })
        }
        const room = await Room.findById(roomId, { reviews: 0 });
        const totalPrice = room.price * Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));

        const booking = await Booking.create({
            guestId,
            guestName,
            guestEmail,
            guestPhone,
            roomId,
            numberOfGuests,
            checkInDate: formateDateTenAM(checkInDate),
            checkOutDate: formateDateTenAM(checkOutDate),
            totalPrice,
            status: "Booked"
        });
        const result = await booking.save();
        if (result) {
            let htmlcontet = `
          <body style="margin: 0; padding: 20px; font-family: 'Segoe UI', sans-serif; background: #f8f9fa;">



                <!-- Guest Details -->
                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                    <h3 style="margin: 0 0 15px 0; color: #2d3436;">
                        <i class="fas fa-user" style="margin-right: 10px; color: #004aad;"></i>
                        Guest Details
                    </h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                        <div>
                            <p style="margin: 0; color: #666;">Full Name</p>
                            <p style="margin: 5px 0 0 0; font-weight: 500;">${guestName}</p>
                        </div>
                        <div>
                            <p style="margin: 0; color: #666;">Contact Number</p>
                            <p style="margin: 5px 0 0 0; font-weight: 500;">
                                <i class="fas fa-phone" style="margin-right: 8px;"></i>
                                ${guestPhone}
                            </p>
                        </div>
                        <div>
                            <p style="margin: 0; color: #666;">Email Address</p>
                            <p style="margin: 5px 0 0 0; font-weight: 500;">
                                <i class="fas fa-envelope" style="margin-right: 8px;"></i>
                                ${guestEmail}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Booking Details -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; background: #f8f9fa; padding: 25px; border-radius: 10px;">
            <div>
                <h3 style="margin: 0 0 15px 0; color: #2d3436;">
                    <i class="fas fa-calendar-check" style="margin-right: 10px; color: #004aad;"></i>
                    Booking Dates
                </h3>
                <div style="display: grid; gap: 12px;">
                    <div>
                        <p style="margin: 0; color: #666;">Check-in Date</p>
                        <p style="margin: 5px 0 0 0; font-weight: 500;">${checkInDate} (2:00 PM)</p>
                    </div>
                    <div>
                        <p style="margin: 0; color: #666;">Check-out Date</p>
                        <p style="margin: 5px 0 0 0; font-weight: 500;">${checkOutDate} (11:00 AM)</p>
                    </div>
                    <div>
                        <p style="margin: 0; color: #666;">Booking Date</p>
                        <p style="margin: 5px 0 0 0; font-weight: 500;">${result.createdAt}}</p>
                    </div>
                </div>
            </div>

            <div>
                <h3 style="margin: 0 0 15px 0; color: #2d3436;">
                    <i class="fas fa-key" style="margin-right: 10px; color: #004aad;"></i>
                    Room Features
                </h3>
                <ul style="margin: 0; padding-left: 20px; color: #444;">
                    <li>50 sqm Luxury Suite</li>
                    <li>Private Balcony</li>
                    <li>King Size Bed</li>
                    <li>Marble Bathroom</li>
                </ul>
            </div>
        </div>

    </div>

   
</body>
        `
            let subject = "Booking Confirmation";
            mail(guestEmail, subject, htmlcontet)
            room.status = "occupied";
            if (await room.save()) {

                const notification = new Notification({
                    recipient: {
                        userId: guestId,
                        userType: "Guest"
                    },
                    message: {
                        title: "Booking Confirmed",
                        content: `
                        Your booking at SunShine hotel has been successfully confirmed. You will be staying in Room ${room.roomNumber} from  ${new Date(checkInDate).toLocaleDateString()} to ${new Date(checkOutDate).toLocaleDateString()}. Please present a valid ID at check-in.
                        Room ${room?.roomNumber} booked for ${new Date(checkInDate).toLocaleDateString()} to ${new Date(checkOutDate).toLocaleDateString()}`
                    },
                    type: "booking",
                    metadata: {
                        roomNumber: room?.roomNumber,
                        bookingId: result._id,
                    }
                })
                const notificationResult = await notification.save();
                if (notificationResult) {
                    return res.status(200).json({ status: true, message: "Room booked successfully", data: { _id: result._id, totalPrice: result.totalPrice, notificationResult } })
                }
            }
            return res.status(200).json({ status: false, message: "Some error occupied" })
        }

    } catch (error) {
        console.log(error)
        return res.status(200).json({ status: false, message: "internal server error!" })
    }
}

//get all bookings by guestId for guest
export const getBookingDetailsByUserId = async (req, res) => {
    try {
        const guestId = await req._id;
        const today = new Date();
        today.setHours(10, 0, 0, 0);
        const upcoming = await Booking.find({ $and: [{ guestId }, { checkInDate: { $gte: today } }, { status: "Booked" }] }).populate("roomId", "roomNumber type");
        const completed = await Booking.find({ $and: [{ guestId }, { checkOutDate: { $lt: today } }, { status: "Booked" }] }).populate("roomId", "roomNumber type");
        const cancelled = await Booking.find({ $and: [{ guestId }, { status: "Cancelled" }] }).populate("roomId", "roomNumber type");
        if (upcoming && completed && cancelled) {
            return res.status(200).json({
                status: true, bookings: { upcoming, completed, cancelled }
            })
        }
        return res.status(200).json({ status: true, message: "Some error occupied" })
    } catch (error) {
        console.log(error)
        res.status(400).json({ status: false, message: "Some error occupied, please try again leter!" })
    }
}


//get all bookings by guestId for admin
export const getBookingDetailsByguestIdForAdmin = async (req, res) => {
    try {
        const guestId = await req.params?.id;
        const today = new Date();
        today.setHours(10, 0, 0, 0);
        const upcoming = await Booking.find({ $and: [{ guestId }, { checkInDate: { $gte: today } }, { status: "Booked" }] }).populate("roomId", "roomNumber type");
        const completed = await Booking.find({ $and: [{ guestId }, { checkOutDate: { $lt: today } }, { status: "Booked" }] }).populate("roomId", "roomNumber type");
        const cancelled = await Booking.find({ $and: [{ guestId }, { status: "Cancelled" }] }).populate("roomId", "roomNumber type");
        if (upcoming && completed && cancelled) {
            return res.status(200).json({
                status: true, bookings: { upcoming, completed, cancelled }
            })
        }
        return res.status(200).json({ status: true, message: "Some error occupied" })
    } catch (error) {
        console.log(error)
        res.status(400).json({ status: false, message: "Some error occupied, please try again leter!" })
    }
}

export const cancelBooking = async (req, res) => {
    try {
        const bookingId = await req?.params?.id;

        const booking = await Booking.findByIdAndUpdate(bookingId,
            { status: "Cancelled" },
            { new: true }
        ).populate("roomId", "roomNumber");
        if (!booking) {
            return res.status(400).json({ status: false, message: "Booking not found" })
        }
        console.log(booking)

        const room = await Room.findById(booking.roomId);
        room.status = "available";
        const roomResult = await room.save();
        const htmlContent = `
        <body style="margin: 0; padding: 20px; font-family: 'Segoe UI', sans-serif; background: #f8f9fa;">
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 15px 0; color: #2d3436;"> Booking cancellation </h3>
            <p style="margin: 0; color: #666;">Dear ${booking?.guestName},</p>
            <p style="margin: 0; color: #666;">We regret to inform you that your booking at SunShine hotel has been cancelled.</p>
            <p style="margin: 0; color: #666;">Booking Details:</p>
            <ul style="margin: 0; padding-left: 20px; color: #444;">
                <li>Room Number: ${booking?.roomId?.roomNumber}</li>
                <li>Check-in Date: ${booking?.checkInDate?.toLocaleDateString()}</li>
                <li>Check-out Date: ${booking?.checkOutDate?.toLocaleDateString()}</li>
            </ul>
            <p style="margin: 0; color: #666;">If you have any questions or concerns, please contact our customer support team at <a href="mailto:sunshineHotel@gmail.com" ">If you have any questions or concerns, please contact our customer support team at <a href="mailto:EMAIL">support@sunshinehotel.com</a>.</p>
            </p>
            <p style="margin: 0; color: #666;">Thank you for choosing SunShine hotel.</p>
            <p style="margin: 0; color: #666;">Best regards,</p>
            <p style="margin: 0; color: #666;">SunShine hotel</p>
        </div>
        </body>
        `

        const { guestId, roomId, _id, guestEmail, checkInDate, checkOutDate, guestName } = booking
        mail(guestEmail, "Booking Cancelled", htmlContent)
        const notification = new Notification({
            recipient: {
                userId: guestId,
                userType: "Guest"
            },
            message: {
                title: "Booking cancelled",
                content: `Room ${roomId?.roomNumber} booking under Guest Name: ${guestName} has been canceled to ${checkInDate?.toLocaleDateString()} to ${checkOutDate?.toLocaleDateString()}`
            },
            type: "cancellation",
            metadata: {
                roomNumber: roomId?.roomNumber,
                bookingId: _id,
            }
        })
        const notificationResult = await notification.save();
        if (roomResult && notificationResult) {
            return res.status(200).json({ status: true, message: "Booking cancelled successfully", data: notificationResult })
        }
        return res.status(200).json({ status: true, message: "Booking not cancelled successfully" })
    } catch (error) {
        console.log(error)
        res.status(400).json({ status: false, message: "Some error occupied, please try again leter!" })
    }
}

// get booking detials by id
export const getBookingDetailsById = async (req, res) => {
    try {
        const bookingId = await req?.params?.id;
        const bookingDetails = await Booking.findById(bookingId).populate("roomId", "roomNumber type");
        if (bookingDetails) {
            return res.status(200).json({ status: true, booking: bookingDetails })
        }
        return res.status(200).json({ status: true, message: "No booking found" })
    } catch (error) {
        console.log(error)
        res.status(400).json({ status: false, message: "Some error occupied, please try again leter!" })
    }
}

// for admin get all bookings
// gel all booking history for admin
export const getAllBookings = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(10, 0, 0, 0);
        const upcoming = await Booking.find({ $and: [{ checkInDate: { $gte: today } }, { status: "Booked" }, { visitStatus: "check-in" }] }, {
            totalPrice: 0,
            numberOfGuests: 0,
            updatedAt: 0,
            createdAt: 0
        }).populate("roomId", "roomNumber type");
        const current = await Booking.find({ $and: [{ checkInDate: { $lte: today } }, { checkOutDate: { $gte: today } }, { status: "Booked" }, { visitStatus: "in-room" }] }, {
            totalPrice: 0,
            numberOfGuests: 0,
            updatedAt: 0,
        }).populate("roomId", "roomNumber type");
        const completed = await Booking.find({ $and: [{ checkOutDate: { $lte: today } }, { status: "Booked" }, { visitStatus: "check-out" }] }, {
            totalPrice: 0,
            numberOfGuests: 0,
            updatedAt: 0,
            createdAt: 0
        }).populate("roomId", "roomNumber type");
        const cancelled = await Booking.find({ $and: [{ status: "Cancelled" }] }, {
            totalPrice: 0,
            numberOfGuests: 0,
            updatedAt: 0,
            createdAt: 0
        }).populate("roomId", "roomNumber type");
        if (upcoming && completed && cancelled && current) {
            return res.status(200).json({
                status: true, bookings: { upcoming, completed, cancelled, current }
            })
        }
        return res.status(200).json({ status: true, message: "Some error occupied" })

    } catch (error) {
        console.log(error)
        res.status(400).json({ status: false, message: "Some error occupied, please try again leter!" })
    }
}

export const getBookingDetialsbyEmailORPhone = async (req, res) => {
    try {
        const { emailOrPhone } = await req?.query;
        const email = emailOrPhone.includes("@") ? emailOrPhone : null;
        const phoneNumber = emailOrPhone.includes("@") ? null : emailOrPhone;
        const bookingDetails = await Booking.find({ $or: [{ guestEmail: email }, { guestPhone: phoneNumber }] });
        if (bookingDetails.length > 0) {
            return res.status(200).json({ status: true, data: bookingDetails })
        }
        return res.status(200).json({ status: true, message: "No booking found" })
    } catch (error) {
        console.log(error)
        res.status(400).json({ status: false, message: "Some error occupied, please try again leter!" })
    }
}

//get Room booking history
export const getRoomBookingHistory = async (req, res) => {
    try {
        const roomId = await req?.params?.id;
        const roomBookingHistory = await Booking.find({ roomId }, { _id: 1, guestId: 1, guestName: 1, checkInDate: 1, checkOutDate: 1 }).populate("guestId", "avature");
        const room = await Room.findById(roomId, { roomNumber: 1, _id: 0 })
        if (roomBookingHistory.length > 0) {
            return res.status(200).json({ status: true, history: roomBookingHistory, roomNumber: room.roomNumber })
        }
        return res.status(200).json({ status: false, message: "No booking found", roomNumber: room.roomNumber })

    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, message: "Some error occupied, please try again leter!" })
    }
}

export const checkInToday = async (req, res) => {
    try {
        const today = new Date();
        const checkInTime = new Date(today);
        checkInTime.setHours(10, 0, 0, 0); // Today 10 AM
        const checkInToday = await Booking.countDocuments({
            $and: [{ checkInDate: { $eq: checkInTime } },
            { status: "Booked" }, { visitStatus: "check-in" }]
        })

        if (checkInToday == 0) {
            return res.status(200).json({ status: false, data: "no any check-in" })
        }
        return res.status(200).json({ status: true, data: checkInToday })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, message: "Some error occupied, please try again leter!" })
    }
}

export const checkOutToday = async (req, res) => {
    try {
        const today = new Date();
        const checkInTime = new Date(today);
        checkInTime.setHours(10, 0, 0, 0); // Today 10 AM

        const checkOutToday = await Booking.countDocuments({
            $and: [{ checkOutDate: { $eq: checkInTime } }, { status: "Booked" }, { visitStatus: "in-room" }]
        })

        console.log(checkOutToday)

        if (checkOutToday == 0) {
            return res.status(200).json({ status: true, data: "no any check-out" })
        }
        return res.status(200).json({ status: true, data: checkOutToday })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ status: false, message: "Some error occupied, please try again leter!" })
    }
}
//done
export const getTodayBookedRoomsCount = async (req, res) => {
    try {
        // Get today's date range
        const todayStart = new Date()

        // Create end time (tomorrow 10:00 AM)
        const todayEnd = new Date(todayStart);
        todayEnd.setDate(todayEnd.getDate()); // Add 1 day
        // todayEnd.setHours(10, 0, 0, 0); // 10:00:00.000

        // Get unique booked rooms for today
        const bookedRooms = await Booking.aggregate([
            {
                $match: {
                    status: "Booked",
                    $and: [
                        { checkInDate: { $lte: todayEnd } },
                        { checkOutDate: { $gte: todayStart } },
                        // { visitStatus: "in-room"}
                    ]
                }
            },
            {
                $group: {
                    _id: "$roomId" // Group by room ID
                }
            },
            {
                $count: "bookedCount" // Count unique rooms
            }
        ]);

        const bookedCount = bookedRooms[0]?.bookedCount || 0;
        if (bookedCount === 0) {
            return res.status(200).json({
                status: true,
                data: "No any occupied"
            });

        }
        return res.status(200).json({
            status: true,
            data: bookedCount
        });



    } catch (error) {
        res.status(500).json({
            status: false,
            error: `Server Error: ${error.message}`
        });
    }
};

export const getCurrentGuest = async (req, res) => {
    try {
        const today = new Date();
        const currrentDate = new Date(today);
        currrentDate.setHours(10, 0, 0, 0); // Today 10 AM
        const currentGuest = await Booking.find({ $and: [{ checkOutDate: { $gte: currrentDate } }, { checkInDate: { $lte: currrentDate } }, { status: "Booked" }, { visitStatus: "in-room" }] }).select("guestId guestName checkInDate checkOutDate").populate("roomId", "roomNumber")
        return res.status(201).json({ status: true, data: currentGuest })
    } catch (error) {
        console.log(error)
        return res.status(401).json({ status: false, message: "Internal server error, please try again leter!" })
    }
}


export const roomAvaibility = async (req, res) => {
    try {
        // Get today's date range
        const date = new Date(req?.query?.date).setHours(10, 0, 0, 0);

        if (isNaN(date)) {
            return res.status(400).json({ status: false, message: "Invalid dates provided!" });
        }
        const bookedRooms = await Booking.find({
            status: { $in: ["Booked"] }, // Include relevant statuses
            checkInDate: { $lte: date },
            checkOutDate: { $gte: date },// Exclude cancelled bookings
            visitStatus: { $nin: ["check-out"] }
        }).select("roomId");

        // Extract booked room IDs
        const bookedRoomIds = bookedRooms.map(booking => booking.roomId);
        // Find rooms that are available based on check-in and check-out dates
        const availableRooms = await Room.aggregate([
            {
                $match: {
                    _id: { $nin: bookedRoomIds.map(id => new mongoose.Types.ObjectId(id)) },
                    status: { $nin: ['maintenance', 'cleaning', 'inprogress'] } // Only consider available rooms
                }
            },
            {
                $addFields: {
                    reviewCount: { $size: "$reviews" }, // Add review count field
                    status: {
                        $cond: {
                            if: { $in: ["$status", ["occupied"]] },
                            then: "available",
                            else: "available"
                        }
                    }
                }
            },
            {
                $project: {
                    roomNumber: 1,
                    type: 1,
                    roomPrice: 1,
                    capacity: 1,
                    price: 1,
                    status: 1,
                    // Exclude reviews array from final output
                }
            }
        ]);


        const occupiedRooms = await Room.aggregate([
            {
                $match: {
                    _id: { $in: bookedRoomIds.map(id => new mongoose.Types.ObjectId(id)) },
                    status: { $nin: ['maintenance', 'cleaning', 'inprogress'] }
                }
            },
            {
                $addFields: {
                    reviewCount: { $size: "$reviews" }, // Add review count field
                    status: {
                        $cond: {
                            if: { $in: ["$status", ["available"]] },
                            then: "occupied",
                            else: "occupied"
                        }
                    }

                }
            },
            {
                $project: {
                    roomNumber: 1,
                    type: 1,
                    roomPrice: 1,
                    capacity: 1,
                    price: 1,
                    status: 1,

                    // Exclude reviews array from final output
                }
            }
        ])

        const maintenanceRooms = await Room.find({ status: { $in: ['maintenance', 'cleaning', 'inprogress'] } }, {
            roomNumber: 1,
            type: 1,
            roomPrice: 1,
            capacity: 1,
            status: 1,
            price: 1,
        })
        // Categorize rooms

        const rooms = [...availableRooms, ...occupiedRooms, ...maintenanceRooms]


        return res.status(200).json({
            status: true,
            rooms: rooms.sort((a, b) => a.roomNumber - b.roomNumber),
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: false,
            error: 'Server Error: ' + error.message
        });
    }
}

export const getTodayRoomStatus = async (req, res) => {
    try {
        // Set 10 AM to 10 AM window
        const today = new Date();
        const checkInTime = new Date(today);
        //checkInTime.setHours(10, 0, 0, 0); // Today 10 AM

        const checkOutTime = new Date(checkInTime);
        // checkOutTime.setDate(checkOutTime.getDate() + 1);
        // checkOutTime.setHours(10, 0, 0, 0); // Tomorrow 10 AM

        // Get all bookings within this period
        const activeBookings = await Booking.find({
            status: "Booked",
            $and: [
                { checkInDate: { $lte: checkOutTime } },
                { checkOutDate: { $gte: checkInTime } },]
        });

        // Get all room IDs from active bookings
        const bookedRoomIds = activeBookings.map(b => b.roomId);

        // Get all rooms with their status
        const allRooms = await Room.aggregate([
            {
                $project: {
                    roomNumber: 1,
                    type: 1,
                    price: 1,
                    status: 1,
                    capacity: 1,
                    isBookedToday: {
                        $cond: {
                            if: { $in: ["$_id", bookedRoomIds] },
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$status",
                    rooms: {
                        $push: {
                            roomNumber: "$roomNumber",
                            type: "$type",
                            price: "$price",
                            capacity: "$capacity",
                            isBookedToday: "$isBookedToday"
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    status: "$_id",
                    rooms: 1,
                    count: 1,
                    _id: 0
                }
            }
        ]);

        res.status(200).json({
            status: true,
            data: allRooms

        });
    } catch (error) {

        res.status(500).json({
            success: false,
            error: `Server Error: ${error.message}`
        });
    }
};

export const getAllBookedRoomGuests = async (req, res) => {
    try {
        const guestdetials = req?.query?.guestdetials
        const today = new Date();
        today.setHours(10, 0, 0, 0);
        const checkIn = await Booking.find({
            $and: [{ checkInDate: { $eq: today } }, { status: "Booked" }, { visitStatus: 'check-in' },
            {
                $or: [
                    { guestName: { $regex: guestdetials, $options: "i" } },
                    { guestEmail: { $regex: guestdetials, $options: "i" } },
                    { guestPhone: { $regex: guestdetials, $options: "i" } },
                ]
            }
            ]
        }, {
            visitStatus: 1,
            numberOfGuests: 1,
            checkInDate: 1,
            checkOutDate: 1,
            roomId: 1,
            guestName: 1,
            guestEmail: 1,
            status: 1,

        }).populate("roomId", "roomNumber")
        const currentGuests = await Booking.find({
            $and: [{ checkOutDate: { $gte: today } }, { status: "Booked" }, { visitStatus: "in-room" },
            {
                $or: [
                    { guestName: { $regex: guestdetials, $options: "i" } },
                    { guestEmail: { $regex: guestdetials, $options: "i" } },
                    { guestPhone: { $regex: guestdetials, $options: "i" } },
                ]
            }
            ]
        }, {
            visitStatus: 1,
            numberOfGuests: 1,
            checkInDate: 1,
            checkOutDate: 1,
            roomId: 1,
            guestName: 1,
            guestEmail: 1,
            status: 1,

        }).populate("roomId", "roomNumber")
        const checkOut = await Booking.find({
            $and: [{ status: "Booked" }, { visitStatus: "check-out" }, { checkOutDate: { $eq: today } }, {

                $or: [
                    { guestName: { $regex: guestdetials, $options: "i" } },
                    { guestEmail: { $regex: guestdetials, $options: "i" } },
                    { guestPhone: { $regex: guestdetials, $options: "i" } },
                ]

            }]
        }, {
            visitStatus: 1,
            numberOfGuests: 1,
            checkInDate: 1,
            checkOutDate: 1,
            roomId: 1,
            guestName: 1,
            guestEmail: 1,
            status: 1,
        }).populate("roomId", "roomNumber")
        if (checkIn && currentGuests && checkOut) {
            return res.status(200).json({
                status: true, guestBookings: { checkIn, currentGuests, checkOut }
            })
        }
        return res.status(200).json({ status: true, message: "Some error occupied" })

    } catch (error) {
        console.log(error)
        res.status(400).json({ status: false, message: "Some error occupied, please try again leter!" })
    }
}

export const checkedIn = async (req, res) => {
    try {
        const id = req?.params?.id;
        const updateVisitedStatus = await Booking.findByIdAndUpdate(id,
            { visitStatus: "in-room" },
            { new: true }
        ).populate("roomId", "roomNumber")
        if (!updateVisitedStatus) {

            return res.status(400).json({ status: false, message: "Some error occupied" })
        }
        const { roomId, guestName, guestId, _id } = updateVisitedStatus
        const notification = new Notification({
            recipient: {
                userId: guestId,
                userType: 'Guest'
            },
            message: {
                title: 'Guest Checked In',
                content: `Dear ${guestName}, Welcome to SunShine Hotel! Your check-in for Room ${roomId?.roomNumber} has been successfully completed.We hope you have a comfortable and enjoyable stay with us.If you need any assistance during your stay, feel free to contact our reception. Thank you for choosing SunShine Hotel!`
            },
            type: 'checkedIn',
            status: 'unread',
            metadata: {
                roomNumber: roomId?.roomNumber,
                bookingId: _id,
            },

        })
        const notificationResult = await notification.save()
        if (notificationResult) {
            checkedInNotification(notificationResult)
            return res.status(200).json({ status: true, message: "Guest checked in successfully" })
        }
        return res.status(200).json({ status: true, message: "Some error occupied!" })
    } catch (
    error
    ) {
        console.log(error)
        return res.status(400).json({ status: false, message: "Some error occupied, please try again leter!" })
    }
}


export const checkedOut = async (req, res) => {
    try {
        const id = req?.params?.id;
        const getBookingDetails = await Booking.findById(id, { checkOutDate: 1 })
        if (!getBookingDetails) {
            return res.status(400).json({ status: false, message: "Some error occupied" })
        }
        const checkOutDate = getBookingDetails?.checkOutDate;
        const today = new Date();
        today.setHours(10, 0, 0, 0);
        if (checkOutDate < today) {
            return res.status(400).json({ status: false, message: "Check-out date has already passed" })
        }
        if (checkOutDate > today) {
            return res.status(400).json({ status: false, message: "Check-out date has not passed" })
        }

        const updateVisitedStatus = await Booking.findByIdAndUpdate(id,
            { visitStatus: "check-out" },
            { new: true }
        )
        if (!updateVisitedStatus) {
            return res.status(400).json({ status: false, message: "Some error occupied" })
        }
        const { roomId, guestName, guestId, _id, checkOutDate: checkOut } = updateVisitedStatus
        const notification = new Notification({
            recipient: {
                userId: guestId,
                userType: 'Guest'
            },
            message: {
                title: 'Guest Checked Out',
                content: `Dear ${guestName}, We hope you had a wonderful stay at SunShine Hotel. Your check-out from Room ${roomId?.roomNumber} on ${checkOut.toLocaleDateString()} has been successfully completed. If you have any feedback or require further assistance, please feel free to contact us. Thank you for choosing SunShine Hotel, and we look forward to welcoming you again in the future!`
            },
            type: 'checkedOut',
            status: 'unread',
            metadata: {
                roomNumber: roomId?.roomNumber,
                bookingId: _id,
            },
        })
        const notificationResult = await notification.save()
        if (notificationResult) {
            checkedOutNotification(notificationResult)
            return res.status(200).json({ status: true, message: "Guest checked out successfully" })
        }
        return res.status(200).json({ status: true, message: "Guest checked out successfully" })
    }
    catch (error) {
        console.log(error)
    }
}

// Get monthly revenue and bookings statistics
export const getMonthlyRevenue = async (req, res) => {
    try {
        const stats = await Booking.aggregate([
            {
                $match: {
                    status: "Booked",
                    visitStatus: "check-out"// Only consider confirmed bookings
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$checkInDate" },
                        month: { $month: "$checkInDate" }
                    },
                    revenue: { $sum: "$totalPrice" },
                    bookings: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    month: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$_id.month", 1] }, then: "January" },
                                { case: { $eq: ["$_id.month", 2] }, then: "February" },
                                { case: { $eq: ["$_id.month", 3] }, then: "March" },
                                { case: { $eq: ["$_id.month", 4] }, then: "April" },
                                { case: { $eq: ["$_id.month", 5] }, then: "May" },
                                { case: { $eq: ["$_id.month", 6] }, then: "June" },
                                { case: { $eq: ["$_id.month", 7] }, then: "July" },
                                { case: { $eq: ["$_id.month", 8] }, then: "August" },
                                { case: { $eq: ["$_id.month", 9] }, then: "September" },
                                { case: { $eq: ["$_id.month", 10] }, then: "October" },
                                { case: { $eq: ["$_id.month", 11] }, then: "November" },
                                { case: { $eq: ["$_id.month", 12] }, then: "December" }
                            ],
                            default: "Unknown"
                        }
                    },
                    revenue: 1,
                    bookings: 1,
                    year: "$_id.year"
                }
            },
            {
                $sort: {
                    year: 1,
                    "monthOrder": 1 // Add monthOrder field first if needed
                }
            }
        ]);

        const data = stats.map(item => ({
            month: item.month,
            revenue: item.revenue,
            bookings: item.bookings
        }))
        return res.status(200).json({
            status: true,
            data: data

        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: 'Some error occupied!',

        });
    }
}

export default router;

