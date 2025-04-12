import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { RoomContext } from "../../state/Room";
import { toast } from "react-toastify";
import { NotificationContext } from "../../state/Notification";

const BookingRoom = () => {
  const navigate = useNavigate();
  const { BookingRoom } = useContext(RoomContext);
  const { newBookingNotification } = useContext(NotificationContext);
  const { id } = useParams();
  const location = useLocation();

  const { roomNumber, capacity, roomPrice } = location?.state;

  const [roomRate, setRoomRate] = useState(roomPrice); // Example room rate per night

  const calculatePrice = (checkIn, checkOut, numberOfGuests) => {
    if (!checkIn || !checkOut) return "";
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
    return nights > 0 ? nights * roomRate * numberOfGuests : "";
  };

  const formik = useFormik({
    initialValues: {
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      roomNumber: roomNumber || "",
      checkInDate: "",
      checkOutDate: "",
      totalPrice: "",
      numberOfGuests: "", // Default to 1 guest
    },
    validationSchema: Yup.object({
      guestName: Yup.string().required("Guest Name is required"),
      guestEmail: Yup.string()
        .email("Invalid email")
        .required("Guest Email is required"),
      guestPhone: Yup.string().required("Guest Phone is required"),
      roomNumber: Yup.string().required("Room Number is required"),
      checkInDate: Yup.date()
        .required("Check-in Date is required")
        .min(new Date(), "Check-in Date cannot be in the past"), // Ensure check-in is today or later
      checkOutDate: Yup.date()
        .required("Check-out Date is required")
        .min(
          Yup.ref("checkInDate"),
          "Check-out Date must be after Check-in Date"
        ), // Ensure check-out is after check-in
      numberOfGuests: Yup.number()
        .min(1, "At least 1 guest is required")
        .max(capacity, `Maximum ${capacity} guests are allowed`)
        .required("Number of Guests is required"),
    }),
    onSubmit: async (values) => {
      const {
        guestName,
        guestEmail,
        guestPhone,
        checkInDate,
        checkOutDate,
        numberOfGuests,
        totalPrice,
      } = values;

      const respose = await BookingRoom({
        roomId: id,
        guestName,
        guestEmail,
        guestPhone,
        checkInDate,
        checkOutDate,
        numberOfGuests,
      });
      const { status, data, message } = await respose;
      if (status) {
        toast.success(message);
        newBookingNotification(data?.notificationResult);
        formik.resetForm();
        navigate(`/room/booking-room/payment/${data._id}`, {
          state: { totalPrice: data.totalPrice },
        });
      } else {
        toast.error(message);
      }
    },
  });

  useEffect(() => {
    formik.setFieldValue(
      "totalPrice",
      calculatePrice(
        formik.values.checkInDate,
        formik.values.checkOutDate,
        formik.values.numberOfGuests
      )
    );
  }, [
    formik.values.checkInDate,
    formik.values.checkOutDate,
    formik.values.numberOfGuests,
  ]);

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4">
        Book a Room (No : {roomNumber})
      </h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <input
          type="text"
          name="guestName"
          placeholder="Guest Name"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.guestName}
          className="w-full p-2 border rounded"
          required
        />
        {formik.touched.guestName && formik.errors.guestName && (
          <div className="text-red-500 text-sm">{formik.errors.guestName}</div>
        )}
        <input
          type="email"
          name="guestEmail"
          placeholder="Guest Email"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.guestEmail}
          className="w-full p-2 border rounded"
          required
        />
        {formik.touched.guestEmail && formik.errors.guestEmail && (
          <div className="text-red-500 text-sm">{formik.errors.guestEmail}</div>
        )}
        <input
          type="text"
          name="guestPhone"
          placeholder="Guest Phone"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.guestPhone}
          className="w-full p-2 border rounded"
          required
        />
        {formik.touched.guestPhone && formik.errors.guestPhone && (
          <div className="text-red-500 text-sm">{formik.errors.guestPhone}</div>
        )}
        <input
          type="date"
          name="checkInDate"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.checkInDate}
          className="w-full p-2 border rounded"
          required
        />
        {formik.touched.checkInDate && formik.errors.checkInDate && (
          <div className="text-red-500 text-sm">
            {formik.errors.checkInDate}
          </div>
        )}
        <input
          type="date"
          name="checkOutDate"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.checkOutDate}
          className="w-full p-2 border rounded"
          required
        />
        {formik.touched.checkOutDate && formik.errors.checkOutDate && (
          <div className="text-red-500 text-sm">
            {formik.errors.checkOutDate}
          </div>
        )}
        <input
          type="number"
          name="numberOfGuests"
          placeholder="Number of Guests"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.numberOfGuests}
          className="w-full p-2 border rounded"
          required
        />
        {formik.touched.numberOfGuests && formik.errors.numberOfGuests && (
          <div className="text-red-500 text-sm">
            {formik.errors.numberOfGuests}
          </div>
        )}
        <input
          type="number"
          name="totalPrice"
          placeholder="Total Price"
          value={formik.values.totalPrice}
          className="w-full p-2 border rounded bg-gray-100"
          readOnly
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Book Now
        </button>
      </form>
    </div>
  );
};

export default BookingRoom;
