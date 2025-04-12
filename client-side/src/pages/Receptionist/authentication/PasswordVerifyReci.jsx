import React, { useContext } from "react";
import { motion } from "framer-motion";
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { passwordScema } from "../../../scema/index";
import { actionCreator } from "../../../redux/index";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { employeePasswordVerificationUrl } from "../../../utils/api";
import { UserContext } from "../../../state/User";

export default function PasswordVerifyReci() {
  const { employeeOtpSender } = useContext(UserContext);
  const dispatch = useDispatch();
  const action = bindActionCreators(actionCreator, dispatch);
  const navigate = useNavigate();
  const location = useLocation();
  const id = location?.state?.data?.id;
  const email = location?.state?.data?.email;
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: {
        id: id,
        password: "",
      },
      validationSchema: passwordScema,
      onSubmit: async (values) => {
        const response = await fetch(employeePasswordVerificationUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        const { status, message, token } = await response.json();
        console.log(token, message, status);
        if (status) {
          token && action.Stafflogin();
          localStorage.setItem("authentication_staff_token", token);
          toast.success(message);
          navigate("/receptionist/dashboard");
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
        <span className=" text-xl font-bold text-gray-800">
          Receptionist Login
        </span>
      </div>
      <div className="w-full e flex justify-center items-start flex-col px-2">
        <p className="text-justify e opacity-100">
          Please enter your password to continue.
        </p>
      </div>
      <div className="flex justify-center gap-1 flex-col">
        <p className="text-red-900 opacity-100">
          {errors.password && touched.password && "*" + errors.password}
        </p>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex justify-center items-center gap-2 w-full flex-wrap lg:flex-nowrap  "
      >
        <input
          type="password"
          placeholder="Enter password"
          name="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full p-4 border-2 border-gray-300 bg-transparent rounded-lg outline-none flex-grow md:w-40 backdrop-blur-sm   "
        />
        <motion.button
          whileHover={{ scale: 0.9 }}
          type="submit"
          className="w-full whitespace-nowrap w-full p-4 border-2 rounded-lg border-gray-300 bg-blue-600   outline-none  md:w-40 hover:bg-blue-400 backdrop-blur-sm "
        >
          Login
        </motion.button>
      </form>

      <Link
        to={"/receptionist/dashboard/verify-account"}
        state={{ id, email }}
        className="text-sm text-red-500 text-start underline w-full"
        onClick={() => employeeOtpSender(id)}
      >
        Clieck here to reset password
      </Link>
    </motion.div>
  );
}
