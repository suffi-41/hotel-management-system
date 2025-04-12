import React, { useState, useContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { RoomContext } from "../../../state/Room";
import { motion } from "framer-motion";
import { formatDate, calculateDays } from "../../../utils/extra";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import DeleteModal from "../../../components/DeleteModal";
import { NotificationContext } from "../../../state/Notification";

const BookedRoom = () => {
  const { getUserAllBookings, cancelBooking } = useContext(RoomContext);
  const { bookingCancelledNotification } = useContext(NotificationContext);

  const [filter, setFilter] = useState("upcoming"); // State to manage the active filter
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["booking"],
    queryFn: getUserAllBookings,
  });

  const [bookings, setBookings] = useState({});
  useEffect(() => {
    if (data?.status) {
      setBookings(data?.bookings);
    } else {
      toast.error(data?.message);
    }
    return () => {
      setBookings({});
    };
  }, [data]);

  const [today] = useState(new Date());
  const cancelBookingBeforeDate = (bookingDate) => {
    //Convert the booking date to a Date object
    const booking = new Date(bookingDate);
    // Calculate one day before the booking date
    const cancelBeforeDate = new Date(booking);
    cancelBeforeDate.setDate(booking.getDate() - 1);
    cancelBeforeDate.setHours(23, 59, 59, 999); // End of the previous day
    // Check if today is before the cancel deadline
    const canCancel = today <= cancelBeforeDate;
    return canCancel;
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const cancelBookingFunction = async (id) => {
    const response = await cancelBooking(id);
    const { status, message, data } = await response;
    if (status) {
      toast.success(message);
      refetch();
      setIsModalOpen(false);
      bookingCancelledNotification(data);
    } else {
      toast.error(message);
    }
    try {
    } catch (error) {
      console.log(error);
    }
  };

  return (
    !isLoading && (
      <div className="p-6 bg-gray-100 bg-white">
        {/* Filter Navigation */}
        <div className="bg-gradient-to-r from-blue-400 to-blue-200 rounded-lg mb-6">
          <h1 className="text-3xl font-bold text-white p-2">My Bookings</h1>
          <div className="p-2 w-auto flex justify-start items-start gap-2">
            {["upcoming", "completed", "cancelled"].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === item
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-200"
                }`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Booking List */}
        <motion.div
          key={filter}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {Array.isArray(bookings[filter]) && bookings[filter].length === 0 ? (
            <div className="flex justify-center items-center">
              No any {filter} booking
            </div>
          ) : (
            Array.isArray(bookings[filter]) &&
            bookings[filter].map((booking) => (
              <div
                key={booking._id}
                className="p-6 bg-white rounded-md shadow-md"
              >
                <h2 className="text-xl font-semibold mb-4 text-start">
                  Booking ID: {booking._id}
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="text-start border-b-2 border-gray-100">
                    <p className="text-gray-600">Room Number</p>
                    <p className="font-medium">{booking?.roomId?.roomNumber}</p>
                  </div>
                  <div className="text-start border-b-2 border-gray-100">
                    <p className="text-gray-600">Room Type</p>
                    <p className="font-medium">{booking?.roomId?.type}</p>
                  </div>
                  <div className="text-start border-b-2 border-gray-100">
                    <p className="text-gray-600">Guest Name</p>
                    <p className="font-medium">{booking?.guestName}</p>
                  </div>
                  <div className="text-start border-b-2 border-gray-100">
                    <p className="text-gray-600">Guest Email</p>
                    <p className="font-medium">{booking?.guestEmail}</p>
                  </div>
                  <div className="text-start border-b-2 border-gray-100">
                    <p className="text-gray-600">Guest Phone</p>
                    <p className="font-medium">{booking?.guestPhone}</p>
                  </div>
                  <div className="text-start border-b-2 border-gray-100">
                    <p className="text-gray-600">Number of Guests</p>
                    <p className="font-medium">{booking.numberOfGuests}</p>
                  </div>
                  <div className="text-start border-b-2 border-gray-100">
                    <p className="text-gray-600">Check-In</p>
                    <p className="font-medium">
                      {formatDate(booking.checkInDate)}
                    </p>
                  </div>
                  <div className="text-start border-b-2 border-gray-100">
                    <p className="text-gray-600">Check-Out</p>
                    <p className="font-medium">
                      {formatDate(booking.checkOutDate)}
                    </p>
                  </div>
                  <div className="text-start border-b-2 border-gray-100">
                    <p className="text-gray-600">Number of Days</p>
                    <p className="font-medium">
                      {calculateDays(booking.checkInDate, booking.checkOutDate)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <Link
                    to={`/user-dashboard/bookings/details/${booking._id}`}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-300 text-sm font-medium"
                  >
                    View
                  </Link>
                  {cancelBookingBeforeDate(booking.checkInDate) &&
                    filter === "upcoming" && (
                      <button
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 text-sm font-medium"
                        onClick={() => setIsModalOpen(!isModalOpen)}
                      >
                        Cancel
                      </button>
                    )}
                  {isModalOpen && (
                    <DeleteModal
                      onClose={setIsModalOpen}
                      onConfirm={cancelBookingFunction}
                      id={booking._id}
                      content="cancel this booking?"
                    />
                  )}
                </div>
              </div>
            ))
          )}
        </motion.div>
      </div>
    )
  );
};

export default BookedRoom;
