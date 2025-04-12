import React from "react";
import { motion } from "framer-motion";
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { loginScema } from "../scema";
import { loginUrl } from "../utils/api";

export default function Login() {
  const navigate = useNavigate();
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        phone: "",
      },
      validationSchema: loginScema,
      onSubmit: async (values) => {
        const response = await fetch(loginUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        const { status, message, data } = await response.json();
        console.log(data, message,status)
        if (status) {
          toast.success(message);
          navigate("password", { state: { data } });
        } else {
          toast.error(message);
        }
      },
    });

  return (
    <motion.div
      className="z-50 sm:w-1/2 w-9/12  p-5 bg-transparent text-white flex flex-col justifuy-center items-center gap-2 backdrop-blur-sm  shadow-lg rounded-lg  "
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full text-4xl font-semibold mb-4 flex items-start gap-2">
        <FaRegCircleUser className="text-4xl font-semibold mt-1" />
        <h1 className=" text-4xl font-semibold">Login</h1>
      </div>
      <div className="w-full text-white flex justify-center items-start flex-col px-2">
        <p className="text-justify text-white opacity-100">
          Welcome back. Please enter your phone number to continue. if you don't
          have an account you can create one.
        </p>
        <Link
          to="/authentication/signup"
          className="text-start text-white opacity-100 cursor-pointer underline hover:text-blue-700"
        >
          Click here to create an account
        </Link>
      </div>
      <div className="flex justify-center gap-1 flex-col">
        <p className="text-red-900 opacity-100">
          {errors.phone && touched.phone && "*" + errors.phone}
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex justify-center items-center gap-2 w-full flex-wrap lg:flex-nowrap  "
      >
        <input
          type="text"
          placeholder="Enter you phone number"
          name="phone"
          value={values.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full p-4 border-2 border-gray-300 bg-transparent placeholder-white  outline-none flex-grow md:w-40 backdrop-blur-sm   "
        />
        <motion.button
          whileHover={{ scale: 0.9 }}
          type="submit"
          className="w-full whitespace-nowrap w-full p-4 border-2 border-gray-300 bg-green-500 placeholder-white  outline-none  md:w-40 hover:bg-transparent backdrop-blur-sm "
        >
          Submit
        </motion.button>
      </form>
    </motion.div>
  );
}
