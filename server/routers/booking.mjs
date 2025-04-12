import { Router } from "express";
import {
    getAvailableRooms,
    bookRoom,
    cancelBooking,
    getBookingDetialsbyEmailORPhone,
    getBookingDetailsById,
    getBookingDetailsByUserId,
    getRoomBookingHistory,
    getBookingDetailsByguestIdForAdmin,
    getAllBookings,
    checkInToday,
    checkOutToday,
    getTodayBookedRoomsCount,
    getCurrentGuest,
    roomAvaibility,
    getTodayRoomStatus,
    getAllBookedRoomGuests,
    checkedIn,
    checkedOut,
    getMonthlyRevenue,
 

} from "../controllers/Booking.mjs"

import { fetchUser } from "../middleware/fetchUser.mjs"
const router = Router();

// user or guest
router.route('/get-available-rooms').get(getAvailableRooms)
router.route('/booking-room').post(fetchUser, bookRoom)
router.route("/get-booking-details/:id").get(getBookingDetailsById)
router.route("/cancel-booking/:id").delete(cancelBooking)
router.route("/get-all-guest-bookings").get(fetchUser, getBookingDetailsByUserId)
router.route("/get-booking-details-by-email-or-phone").get(getBookingDetialsbyEmailORPhone)

router.route("/get-booking-history/:id").get(getRoomBookingHistory)

//admin
router.route("/get-all-bookings-by-guestId/:id").get(getBookingDetailsByguestIdForAdmin)
router.route("/get-all-bookings").get(getAllBookings)

router.route("/check-in-today").get(checkInToday)
router.route("/check-out-today").get(checkOutToday)
router.route("/totalBookedRooms").get(getTodayBookedRoomsCount)

router.route("/get-current-guest").get(getCurrentGuest);
router.route("/room-avaibility").get(roomAvaibility)
router.route("/today-room-status").get(getTodayRoomStatus)

router.route("/get-all-booked-room-guests").get(getAllBookedRoomGuests)
router.route("/checked-in/:id").put(checkedIn)
router.route("/checked-out/:id").put(checkedOut)

router.route("/monthly-revenue").get(getMonthlyRevenue)




export default router;