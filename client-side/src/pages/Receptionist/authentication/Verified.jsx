import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { FaRegCircleUser } from "react-icons/fa6";
import { useFormik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { verifyScema } from "../../../scema/index";
import { middle_hidden } from "../../../utils/extra";
import { UserContext } from "../../../state/User";

export default function Verified() {
  const { employeeOtpSender, employeeVerification } = useContext(UserContext);
  const navigate = useNavigate();
  const [time, setTime] = useState(60);

  const timeout = setTimeout(() => {
    setTime(time - 1);
  }, 1000);
  useEffect(() => {
    if (time === 0) {
      clearTimeout(timeout);
      toast.error("Time out");
    }
  }, [time]);

  const resendOtp = async () => {
    const { status, message } = await employeeOtpSender(id);
    if (status) {
      toast.success(message);
      setTime(60);
    } else {
      toast.error(message);
    }
  };

  const location = useLocation();
  const id = location?.state?.id;
  const email = location?.state?.email;
  const email_hidden = middle_hidden(email);

  const { values, errors, handleChange, handleSubmit, handleBlur, touched } =
    useFormik({
      initialValues: {
        code: "",
        id,
      },
      validationSchema: verifyScema,
      onSubmit: async (values) => {
        const { status, message } = await employeeVerification(values);
        if (status) {
          toast.success(message);
          navigate("/receptionist/dashboard/reset-password", {
            state: { id },
          });
        } else {
          toast.error(message);
        }
      },
    });

  return (
    <motion.div
      className=" z-10 sm:w-11/12   md:w-9/12 w-full max-w-xl  sm:h-auto h-[calc(100vh-0.5rem)]  p-5 bg-white flex flex-col justifuy-center items-center gap-2 backdrop-blur-sm  shadow-lg md:rounded-lg pt-10"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full text-4xl font-semibold mb-4 flex items-start gap-2">
        <FaRegCircleUser className="text-4xl font-semibold " />
        <h1 className=" text-4xl font-semibold">Verify Your Account</h1>
      </div>
      <div className="w-full  px-2">
        <p className="text-justify  opacity-100">
          We sent you a verification code to your email address ( {email_hidden}
          ). Please enter the code below to verify your account.
        </p>
      </div>
      <div className="flex justify-center gap-1 flex-col">
        <p className="text-red-900 opacity-100">
          {errors.code && touched.code && "*" + errors.code}
        </p>
      </div>
      {time >= 0 ? (
        <p className=" font-bold opacity-100">{time} Seconds</p>
      ) : (
        <p
          className=" font-bold opacity-100 underline cursor-pointer"
          onClick={resendOtp}
        >
          Resend
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex justify-center items-center gap-2 w-full flex-wrap lg:flex-nowrap  "
      >
        <input
          type="text"
          placeholder="Enter verification code"
          name="code"
          id="code"
          value={values.code}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full p-4 border-2 border-gray-300  outline-none flex-grow md:w-40 "
        />
        <motion.button
          whileHover={{ scale: 0.9 }}
          type="submit"
          className="w-full whitespace-nowrap w-full p-4 border-2 border-gray-300 bg-blue-500 outline-none  md:w-40  "
        >
          Verify
        </motion.button>
      </form>
    </motion.div>
  );
}
