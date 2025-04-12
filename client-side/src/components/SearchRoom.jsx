import React, { useContext, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { ReactTyped } from "react-typed";
import { RoomContext } from "../state/Room";
import { toast } from "react-toastify";

// redux
import { actionCreator } from "../redux";
import { bindActionCreators } from "redux";
import { useSelector, useDispatch } from "react-redux";

export default function SearchRoom({ scrollY, scrollLength }) {
  const { rooms } = useSelector((state) => state.roomReducer);
  const dispatch = useDispatch();
  const action = bindActionCreators(actionCreator, dispatch);
  const { findAvailbleRoom } = useContext(RoomContext);
  // Define Formik Hook
  const formik = useFormik({
    initialValues: {
      state: "",
      city: "",
      checkInDate: "",
      checkOutDate: "",
    },
    validationSchema: Yup.object({
      state: Yup.string().required("State is required"),
      city: Yup.string().required("City is required"),
      checkInDate: Yup.date().required("Check-in date is required"),
      checkOutDate: Yup.date()
        .required("Check-out date is required")
        .min(Yup.ref("checkInDate"), "Check-out date must be after Check-in"),
    }),
    onSubmit: async (values) => {
      const response = await findAvailbleRoom(
        values.checkInDate,
        values.checkOutDate
      );
      const { status, data, message } = await response;

      if (status) {
        action.SetRooms(data);
        toast.success("scroll the page to see the availble room details");
      } else {
        toast.error(message);
      }
    },
  });

  return (
    <motion.div
      className="z-10 relative sm:w-1/2 w-9/12 p-5 bg-transparent text-white flex flex-col justify-center items-center gap-2"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="w-full text-4xl h-20 md:h-auto md:text-5xl lg:text-6xl xl:text-7xl font-semibold mb-4">
        <ReactTyped
          strings={["A Luxury Stay", "A Deluxe Stay", "A Business Stay"]}
          typeSpeed={40}
          backSpeed={50}
          loop
        />
      </h1>
      {/* Form */}
      <form
        onSubmit={formik.handleSubmit}
        className="flex justify-center items-center gap-2 w-full flex-wrap lg:flex-nowrap backdrop-blur-sm"
      >
        {/* State Input */}
        <div className="flex flex-col w-full md:w-40">
          <input
            type="text"
            placeholder="State"
            className="w-full p-4 border-gray-300 border-s-2 bg-transparent placeholder-white outline-none flex-grow "
            {...formik.getFieldProps("state")}
          />
          {formik.touched.state && formik.errors.state && (
            <p className="text-white text-sm mt-1">{formik.errors.state}</p>
          )}
        </div>

        {/* City Input */}
        <div className="flex flex-col w-full md:w-40">
          <input
            type="text"
            placeholder="City"
            className="w-full p-4  border-gray-300 border-s-2 bg-transparent placeholder-white outline-none flex-grow "
            {...formik.getFieldProps("city")}
          />
          {formik.touched.city && formik.errors.city && (
            <p className="text-white text-sm mt-1">{formik.errors.city}</p>
          )}
        </div>

        {/* Check-In Date Input */}
        <div className="flex flex-col w-full md:w-40">
          <input
            type="text"
            id="check-in-date"
            className="w-full p-4 border-gray-300 border-s-2 bg-transparent placeholder-white outline-none flex-grow "
            placeholder="Check-In Date"
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => {
              if (!e.target.value) e.target.type = "text";
            }}
            {...formik.getFieldProps("checkInDate")}
          />
          {formik.touched.checkInDate && formik.errors.checkInDate && (
            <p className="text-white text-sm mt-1">
              {formik.errors.checkInDate}
            </p>
          )}
        </div>

        {/* Check-Out Date Input */}
        <div className="flex flex-col w-full md:w-40">
          <input
            type="text"
            id="check-out-date"
            className="w-full p-4 border-gray-300 border-s-2 bg-transparent placeholder-white outline-none flex-grow "
            placeholder="Check-Out Date"
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => {
              if (!e.target.value) e.target.type = "text";
            }}
            {...formik.getFieldProps("checkOutDate")}
          />
          {formik.touched.checkOutDate && formik.errors.checkOutDate && (
            <p className="text-white text-sm mt-1">
              {formik.errors.checkOutDate}
            </p>
          )}
        </div>

        {/* Submit Button */}

        <motion.button
          whileHover={{ scale: 0.9 }}
          type="submit"
          className="w-full whitespace-nowrap p-4 border-s-2 border-gray-300 bg-green-400 placeholder-white outline-none flex-grow md:w-40 hover:bg-transparent "
        >
          <a href="#available-rooms">Search Now</a>
        </motion.button>
      </form>
    </motion.div>
  );
}
