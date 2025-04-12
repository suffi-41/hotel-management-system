import User from "../models/User.mjs";
import Employees from "../models/Employees.mjs"
import Booking from "../models/Booking.mjs";
import Room from "../models/Room.mjs";

export const getAllCollectionDataLength = async (req, res) => {
    try {
        const currentGuest = await User.countDocuments();
        const activeusers = await User.countDocuments({ isBlocked: false });
        const inactivateUsers = await User.countDocuments({ isBlocked: true });

        const users = [
            {
                name: "Total Users",
                length: totalUsers,
                status: "blue"
            }, {
                name: "Active Users",
                length: activeusers,
                status: "green"
            }, {
                name: "Inactivate Users",
                length: inactivateUsers,
                status: "red"
            }
        ]
        // const totalsEmployees = await Employees.countDocuments();
        // const activeEmployees = await Employees.countDocuments({ isActive: false });
        // const inactivateEmployees = await Employees.countDocuments({ isActive: true });
        // const onLeaveEmployees = await Employees.countDocuments({ onLeave: true });
        // const onDeutyEmployees = await Employees.countDocuments({ onLeave: false });
        // const employees = [
        //     {
        //         name: "Total Employess",
        //         length: totalsEmployees,
        //         status: "blue"
        //     },
        //     {
        //         name: "Active Employess",
        //         length: activeEmployees,
        //         status: "green"
        //     },
        //     {
        //         name: "Inactivate Employess",
        //         length: inactivateEmployees,
        //         status: "red"
        //     },
        //     {
        //         name: "OnLeave Employess",
        //         length: onLeaveEmployees,
        //         status: "blue"
        //     }, {
        //         name: "OnDeuty Employess",
        //         length: onDeutyEmployees,
        //         status: "green"
        //     }


        // ]

        // const today = new Date();
        // today.setHours(0, 0, 0, 0);
        // const upcomingBookings = await Booking.countDocuments({ $and: [{ checkInDate: { $gte: today } }, { status: "Booked" }] });

        return res.status(201).json({ status: true, users })
    } catch (error) {
        console.log(error).message
        res.status(500).json({
            status: false,
            message: "Some Error occured"
        })
    }
}
