import React from "react";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { FaUser, FaEnvelope, FaComment,FaQuestionCircle } from "react-icons/fa"; // Import icons
import { contactUrl } from "../../utils/api";

// Yup validation schema
const ContactSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  subject: Yup.string().required("Subject is required"),
  message: Yup.string().required("Message is required"),
});

const ContactPage = () => {
  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    validationSchema: ContactSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const toastId = toast.loading("Sending...");
        const response = await fetch(contactUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        const { message, status } = await response.json();
        if (status) {
          resetForm();
          toast.update(toastId, {
            render: message,
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });
        } else {
          toast.update(toastId, {
            render: message,
            type: "error",
            isLoading: false,
            autoClose: 2000,
          });
        }
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white flex items-center justify-center p-6"
    >
      <div className="bg-white md:rounded-lg md:shadow-2xl p-2 md:p-8 md:max-w-4xl w-full md:mx-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Contact Us
        </h1>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 text-start px-2"
            >
              Name
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400" /> {/* Icon */}
              </div>
              <input
                id="name"
                name="name"
                type="text"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                className="block w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            </div>
            {formik.touched.name && formik.errors.name ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.name}
              </div>
            ) : null}
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 text-start px-2"
            >
              Email
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" /> {/* Icon */}
              </div>
              <input
                id="email"
                name="email"
                type="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className="block w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.email}
              </div>
            ) : null}
          </div>
          {/* {subject} */}
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700 text-start px-2"
            >
              Subject
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaQuestionCircle className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="subject"
                name="subject"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.subject}
                className="block w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="">Select a subject</option>
                <option value="Reservation Inquiry">
                  Booking & Reservations
                </option>
                <option value="Special Requests">Special Accommodations</option>
                <option value="Feedback/Complaint">
                  Feedback & Complaints
                </option>
                <option value="Event Inquiry">Events & Conferences</option>
                <option value="Emergency Contact">Urgent Assistance</option>
                <option value="General Inquiry">General Questions</option>
              </select>
            </div>
            {formik.touched.subject && formik.errors.subject ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.subject}
              </div>
            ) : null}
          </div>

          {/* Message Field */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 text-start px-2"
            >
              Message
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                <FaComment className="h-5 w-5 text-gray-400" /> {/* Icon */}
              </div>
              <textarea
                id="message"
                name="message"
                rows="4"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.message}
                className="block w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your message"
              />
            </div>
            {formik.touched.message && formik.errors.message ? (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.message}
              </div>
            ) : null}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
            >
              <FaEnvelope className="mr-2" /> {/* Icon */}
              Submit
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ContactPage;
