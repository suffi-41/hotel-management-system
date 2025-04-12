
import Booking from '../models/Booking.mjs';
import Notification from '../models/Notification.mjs';
import { Server } from 'socket.io';
import cron from 'node-cron';
import mail from '../config/_mail.mjs';

const io = new Server(4140, {
    cors: {
        origin: '*'
    }
});

let active_users = []

//Automatically send notifications  to guests
const checkInHtmlContent = (guestname, roomNumber) => {
    return (
        `<div style="font-family: Arial; padding: 20px;">
        <h2 style="color: #2d3436;">Check-In alert</h2>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; ">
          <p>Dear Guest ${guestname}</p>
          <p>We hope this message finds you well. We wanted to inform you that your check-in is scheduled for tomorrow. Please arrive at the hotel at the specified time.</p>
          <p><strong>Check-in Time:</strong> 10:00 AM</p>
          <p><strong> Room Number: ${roomNumber}</strong> 101</p>
          <p>If you have any questions or need assistance, please contact our hotel receptionist.</p>
          <p>Thank you for choosing our hotel.</p>
          <p>Best regards,</p>
        </div>
        <div style="margin-top: 20px;">
          <p>Note: This is an automated message. Please do not reply to this email.</p>
        </div>

      </div>`
    )
}

const checkInHtmlContentToday = (guestname, roomNumber) => {
    return (
        `<div style="font-family: Arial; padding: 20px;">
        <h2 style="color: #2d3436;">Check-In alert</h2>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; ">
          <p>Dear Guest ${guestname}</p>
          <p>We hope this message finds you well. We wanted to inform you that your check-in is scheduled for today. Please arrive at the hotel at the specified time.</p>
          <p><strong>Check-in Time:</strong> 10:00 AM</p>
          <p><strong> Room Number: ${roomNumber}</strong> 101</p>
          <p>If you have any questions or need assistance, please contact our hotel receptionist.</p>
          <p>Thank you for choosing our hotel.</p>
          <p>Best regards,</p>
        </div>
        <div style="margin-top: 20px;">
          <p>Note: This is an automated message. Please do not reply to this email.</p>
        </div>

      </div>`
    )
}

const checkOutHtmlContent = (guestname, roomNumber) => {
    return (
        `<div style="font-family: Arial; padding: 20px;">
        <h2 style="color: #2d3436;">Check-Out alert</h2>
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; ">
          <p>Dear Guest ${guestname}</p>
          <p>We hope this message finds you well. We wanted to inform you that your check-out is scheduled for tomorrow. Please arrive at the hotel at the specified time.</p>
          <p><strong>Check-out Time:</strong> 10:00 AM</p> 
          <p><strong> Room Number: ${roomNumber}</strong> 101</p>
          <p>If you have any questions or need assistance, please contact our hotel receptionist.</p>
          <p>Thank you for choosing our hotel.</p>
          <p>Best regards,</p>
        </div>
        <div style="margin-top: 20px;">
          <p>Note: This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>`
    )
}

//0 20 * * *
//*/1 * * * *

// chck-in tomorrow  alert notification automatically generated
cron.schedule('0 20 * * *',
    async () => {
        try {
            // Get start/end of tomorrow (UTC)
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0); // Start of tomorrow (00:00:00.000)
            const nextDay = new Date(tomorrow);
            nextDay.setDate(tomorrow.getDate() + 1); // Start of day after tomorrow

            const checkInTomorrow = await Booking.find({
                checkInDate: {
                    $gte: tomorrow,  // Greater than or equal to start of tomorrow
                    $lt: nextDay     // Less than start of next day
                },
                status: "Booked",
                visitStatus: "check-in"
            }, { guestEmail: 1, guestName: 1, roomNumber: 1, checkInDate: 1, guestId: 1 }).populate("roomId", "roomNumber");

            if (checkInTomorrow?.length !== 0) {
                checkInTomorrow?.forEach(async (item) => {
                    mail(item?.guestEmail, "Check-In alert", checkInHtmlContent(item?.guestName, item?.roomId?.roomNumber))
                    const notification = await Notification.create({
                        recipient: {
                            userId: item?.guestId,
                            userType: 'Guest'
                        },
                        message: {
                            title: "Check-In alert",
                            content: `Dear ${item?.guestName}, we hope you're doing well. This is a reminder that your check-in at Sunshine hotel for Room ${item?.roomId?.roomNumber} is scheduled for tomorrow, ${item?.checkInDate}. Please arrive at the hotel at the specified time. If you need any assistance, feel free to contact us. We look forward to welcoming you!`
                        },
                        type: "checkin",
                        metadata: {
                            roomNumber: item?.roomId?.roomNumber,
                            bookingId: item?._id
                        },
                    })
                    const notificationResult = await notification.save()
                    if (notificationResult) {
                        const socketId = active_users?.find(async (user) => await user?.userId === item?.guestId)?.socketId
                        console.log(socketId)
                        io.sockets.to(socketId).emit("check-in-alert", notificationResult)

                    }
                })
            }
        } catch (error) {
            console.log(error)

        }
    }
)

// check in today alert notification automatically generated
cron.schedule('0 8 * * *',
    async () => {
        try {
            // Set 10 AM to 10 AM window
            const today = new Date();
            const checkInTime = new Date(today);
            checkInTime.setHours(10, 0, 0, 0); // Today 10 AM

            const checkInToday = await Booking.find({
                $and: [{ checkInDate: { $eq: checkInTime } },
                { status: "Booked" }, { visitStatus: "check-in" }]
            }, { guestEmail: 1, guestName: 1, roomNumber: 1, checkInDate: 1, guestId: 1 }).populate("roomId", "roomNumber");

            if (checkInToday?.length !== 0) {
                checkInToday?.forEach(async (item) => {
                    mail(item?.guestEmail, "Check-In alert", checkInHtmlContentToday(item?.guestName, item?.roomId?.roomNumber))
                    const notification = await Notification.create({
                        recipient: {
                            userId: item?.guestId,
                            userType: 'Guest'
                        },
                        message: {
                            title: "Check-In alert",
                            content: `Dear ${item?.guestName}, we hope you're doing well. This is a reminder that your check-in at Sunshine hotel for Room ${item?.roomId?.roomNumber} is scheduled for tomorrow, ${item?.checkInDate}. Please arrive at the hotel at the specified time. If you need any assistance, feel free to contact us. We look forward to welcoming you!`
                        },
                        type: "checkin",
                        metadata: {
                            roomNumber: item?.roomId?.roomNumber,
                            bookingId: item?._id
                        },
                    })
                    const notificationResult = await notification.save()
                    if (notificationResult) {
                        const socketId = active_users?.find(async (user) => await user?.userId === item?.guestId)?.socketId
                        console.log(socketId)
                        io.sockets.to(socketId).emit("check-in-alert", notificationResult)
                    }
                })
            }
        } catch (error) {
            console.log(error)

        }
    }
)

// chock out tomorrow alert notification automatically generated
cron.schedule('0 18 * * *',
    async () => {
        try {
            // Get start/end of tomorrow (UTC)
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0); // Start of tomorrow (00:00:00.000)
            const nextDay = new Date(tomorrow);
            nextDay.setDate(tomorrow.getDate() + 1); // Start of day after tomorrow

            const checkOutTomorrow = await Booking.find({
                checkOutDate: {
                    $gte: tomorrow,  // Greater than or equal to start of tomorrow
                    $lt: nextDay     // Less than start of next day
                },
                status: "Booked",
                visitStatus: "in-room"
            })
            if (checkOutTomorrow?.length !== 0) {
                checkOutTomorrow?.forEach(async (item) => {
                    mail(item?.guestEmail, "Check-Out alert", checkOutHtmlContent(item?.guestName, item?.roomId?.roomNumber))
                    const notification = await Notification.create({
                        recipient: {
                            userId: item?.guestId,
                            userType: 'Guest'
                        },
                        message: {
                            title: "Check-Out alert",
                            content: `Dear ${item?.guestName},We hope you're doing well. This is a reminder that your check-out from Sunshine Hotel for Room ${item?.roomId?.roomNumber} is scheduled for tomorrow, ${item?.checkOutDate}. Please ensure all personal belongings are packed and any pending dues are settled before departure.
                            If you need any assistance, feel free to contact us. Thank you for choosing Sunshine Hotel—we hope to welcome you again soon!`
                        },
                        type: "checkout",
                        metadata: {
                            roomNumber: item?.roomId?.roomNumber,
                            bookingId: item?._id
                        },

                    })
                    const notificationResult = await notification.save()
                    if (notificationResult) {
                        const socketId = active_users?.find(async (user) => await user?.userId === item?.guestId)?.socketId
                        console.log(socketId)
                        io.sockets.to(socketId).emit("check-out-alert", notificationResult)
                    }

                })
            }
        }
        catch (error) {
            console.log(error)
        }
    }
);

// check out today alert notification automatically generated
cron.schedule('0 18 * * *',
    async () => {
        try {
            // Get start/end of tomorrow (UTC)
            const today = new Date();
            const checkInTime = new Date(today);
            checkInTime.setHours(10, 0, 0, 0); // Today 10 AM
            const checkOutToday = await Booking.find({
                $and: [{ checkOutDate: { $eq: checkInTime } },
                { status: "Booked" }, { visitStatus: "check-in" }]
            })
            if (checkOutToday?.length !== 0) {
                checkOutToday?.forEach(async (item) => {
                    mail(item?.guestEmail, "Check-Out alert", checkOutHtmlContent(item?.guestName, item?.roomId?.roomNumber))
                    const notification = await Notification.create({
                        recipient: {
                            userId: item?.guestId,
                            userType: 'Guest'
                        },
                        message: {
                            title: "Check-Out alert",
                            content: `Dear ${item?.guestName},We hope you're doing well. This is a reminder that your check-out from Sunshine Hotel for Room ${item?.roomId?.roomNumber} is scheduled for today before 10 AM, ${item?.checkOutDate}. Please ensure all personal belongings are packed and any pending dues are settled before departure.
                            If you need any assistance, feel free to contact us. Thank you for choosing Sunshine Hotel—we hope to welcome you again soon!`
                        },
                        type: "checkout",
                        metadata: {
                            roomNumber: item?.roomId?.roomNumber,
                            bookingId: item?._id
                        },

                    })
                    const notificationResult = await notification.save()
                    if (notificationResult) {
                        const socketId = active_users?.find(async (user) => await user?.userId === item?.guestId)?.socketId
                        io.sockets.to(socketId).emit("check-out-alert", notificationResult)
                    }
                })
            }
        }
        catch (error) {
            console.log(error)
        }
    }
);


// Socket.io setup
io.on("connection", (socket) => {
    console.log("Socket server is actived!")
    // Join role-specific rooms
    socket.on("join-room", (user) => {
        console.log(user)
        if (!active_users.some((user) => user.userId === user.userId)) {
            active_users?.push({
                userId: user.userId,
                role: user.role,
                socketId: socket.id
            })
        }
        console.log(active_users)
        if (user.role === "guest") {
            socket.join("guests");
        }
        if (user.role === "receptionist") {
            socket.join("receptionists");
        }
        if (user.role === "manager") {
            socket.join("managers");
        }
    });

    // Broadcast to receptionists when guest creates request
    socket.on("new-booking", async (data) => {
        const { recipient, message, type, metadata } = data
        const bookingId = metadata?.bookingId;
        const booking = await Booking.findById(bookingId, { checkInDate: 1, checkOutDate: 1, guestName: 1, numberOfGuests: 1 }).populate("roomId", "roomNumber")


        const reciptionoistNotification = new Notification({
            recipient: { ...recipient, userType: "Reciptionist" },
            message: { message, title: "Booking Confirmed", content: `A new booking has been confirmed for Guest Name: ${booking?.guestName} in Room ${booking?.roomId?.roomNumber} from ${(booking?.checkInDate)?.toLocaleDateString()} to ${(booking?.checkOutDate)?.toLocaleDateString()} for ${booking?.numberOfGuests} guest` },
            type,
            metadata
        })

        const managerNotification = new Notification({
            recipient: { ...recipient, userType: "Manager" },
            message: { message, title: "Booking Confirmed", content: `A new booking has been confirmed for Guest Name: ${booking?.guestName} in Room ${booking?.roomId?.roomNumber} from ${(booking?.checkInDate).toLocaleDateString()} to ${(booking?.checkOutDate).toLocaleDateString()} for ${booking?.numberOfGuests} guest` },
            type,
            metadata
        })

        const managerResult = await managerNotification.save();
        const reciResult = await reciptionoistNotification.save()
        if (reciResult && managerResult) {
            io.to("receptionists").emit("new-booking", reciResult);
            io.to("managers").emit("new-booking", managerResult);
        }

    });

   

    socket.on("cancelled-booking", async (data) => {
        const { recipient, message, type, metadata } = await data
        const bookingId = metadata?.bookingId
        const booking = await Booking.findById(bookingId, { checkInDate: 1, checkOutDate: 1, guestName: 1 }).populate("roomId", "roomNumber")
        const reciptionoistNotification = new Notification({
            recipient: { ...recipient, userType: "Reciptionist" },
            message: { message, title: "Booking cancelled", content: `The booking for Guest Name: ${booking?.guestName} in Room ${booking?.roomId?.roomNumber}, scheduled from ${(booking?.checkInDate).toLocaleDateString()} to ${(booking.checkOutDate).toLocaleDateString()}, has been canceled` },
            type,
            metadata
        })
        const managerNotification = new Notification({
            recipient: { ...recipient, userType: "Manager" },
            message: { message, title: "Booking cancelled", content: `The booking for Guest Name: ${booking?.guestName} in Room ${booking?.roomId?.roomNumber}, scheduled from ${(booking?.checkInDate).toLocaleDateString()} to ${(booking.checkOutDate).toLocaleDateString()}, has been canceled` },
            type,
            metadata
        })

        const managerResult = await managerNotification.save();
        const reciResult = await reciptionoistNotification.save()
        if (reciResult && managerResult) {
            const activeUser = active_users?.find(async (user) => await user?.userId === recipient?.userId)
            if (activeUser?.role === "guest") {
                const socketId = activeUser?.socketId;
                io.sockets.to(socketId).emit("cancelled-booking", data)
            }
            io.to("receptionists").emit("cancelled-booking", reciResult);
            io.to("managers").emit("cancelled-booking", managerResult);
        }
    }
    );

    // Alert managers for urgent issues
    socket.on("urgent-alert", (data) => {
        io.to("managers").emit("priority-alert", data);
    });

    socket.on("disconnect", () => {
        const user = active_users.find((user) => user.socketId === socket.id);
        if (user) {
            active_users = active_users.filter((user) => user.socketId !== socket.id);
        }
    })

});


export const checkedInNotification = (data) => {
    try {
        const activeUser = active_users?.find(async (user) => await user?.userId === data?.recipient?.userId)
        if (activeUser?.role === "guest") {
            const socketId = activeUser?.socketId;
            io.sockets.to(socketId).emit("checked-in", data)
        }
    } catch (error) {
        console.log(error)
    }
}

export const checkedOutNotification = (data) => {
    try {
        const activeUser = active_users?.find(async (user) => await user?.userId === data?.recipient?.userId)
        if (activeUser?.role === "guest") {
            const socketId = activeUser?.socketId;
            io.sockets.to(socketId).emit("checked-out", data)
        }
    }
    catch (error) {
        console.log(error)
    }
}








