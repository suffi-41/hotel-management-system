import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MdHome, MdContactSupport } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";
import { UserContext } from "../state/User";

import {
  FaHistory,
  FaMoneyCheckAlt,
  FaCalendarAlt,
  FaHome,
  FaUsers,
  FaHotel,
  FaMoneyBill,
  FaChartLine,
  FaBell,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";

import { IoNotificationsCircleSharp } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import { useLocation } from "react-router-dom";

import Navbar from "../pages/Admin/authentication/conponent/Navbar";
import Footer from "../pages/Admin/authentication/conponent/Footer";
import { admin_token } from "../utils/extra";

//redux
import { actionCreator } from "../redux";
import { bindActionCreators } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const AdminDashboard = ({ children }) => {
  const dispatch = useDispatch();
  const action = bindActionCreators(actionCreator, dispatch);
  const { unreadLength } = useSelector((state) => state?.notificationReducer);

  const { geAdminAvatueAndId } = useContext(UserContext);
  const adminToken = admin_token();
  const navigate = useNavigate();
  const { isAdminLogged } = useSelector((state) => state.isLoggedReducer);
  useEffect(() => {
    !isAdminLogged && !adminToken && navigate("/admin/login");
  }, [adminToken, isAdminLogged]);
  const location = useLocation();
  const { pathname } = location;

  const getAvature = async () => {
    if (isAdminLogged) {
      const data = await geAdminAvatueAndId();
      console.log(data);
      if (data?.status) {
        action.setManagerAvatuer(data.avature, data.id);
      } else {
        toast.error(data?.message);
      }
    }
  };

  useEffect(() => {
    getAvature();
  }, [isAdminLogged]);

  const { managerAvature: avature } = useSelector(
    (state) => state.userAvatureReducer
  );

  // logout
  const logOut = async () => {
    localStorage.removeItem("authentication_admin_token");
    action.Adminlogout();
    toast.error("Logout Successfully");
    navigate("/admin/login");
  };

  return !isAdminLogged ? (
    <div className="h-screen w-screen  bg-gray-100 flex  flex-col justify-between items-center">
      <Navbar />
      {(pathname === "/admin/login" || pathname === "/admin/password-verify") &&
        children}
      <Footer />
    </div>
  ) : (
    isAdminLogged && (
      <div className="min-h-screen  bg-gray-100 flex md:flex-row flex-col">
        {/* Sidebar */}
        <aside className="hidden w-68 bg-blue-600 text-white md:flex flex-col px-4 space-y-6 h-screen overflow-auto">
          <h1 className=" px-4 text-start text-2xl font-bold sticky top-0 mt-10 bg-blue-600 ">
            Admin Dashboard
          </h1>
          <nav className="flex flex-col justify-between h-screen">
            <ul className="space-y-4">
              <li className="mb-4">
                <Link
                  to="/admin"
                  className="flex items-center hover:bg-blue-700 p-2 rounded"
                >
                  <FaHome className="mr-2" /> Dashboard
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to="/admin/dashboard/rooms"
                  className="flex items-center hover:bg-blue-700 p-2 rounded"
                >
                  <FaHotel className="mr-2" /> Rooms
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to="/admin/dashboard/users"
                  className="flex items-center hover:bg-blue-700 p-2 rounded"
                >
                  <FaUsers className="mr-2" /> Users
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to="/admin/dashboard/bookings"
                  className="flex items-center hover:bg-blue-700 p-2 rounded"
                >
                  <FaMoneyBill className="mr-2" /> Billing
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to="/admin/dashboard/report"
                  className="flex items-center hover:bg-blue-700 p-2 rounded"
                >
                  <FaChartLine className="mr-2" /> Reports
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to="/admin/dashboard/room-booking-history"
                  className="flex items-center hover:bg-blue-700 p-2 rounded"
                >
                  <FaHistory className="mr-2" /> Booking History
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to="/admin/dashboard/notification"
                  className="flex items-center hover:bg-blue-700 p-2 rounded "
                >
                  <div className="relative">
                    <IoNotificationsCircleSharp className="mr-2 text-xl" />
                    {unreadLength !== 0 && (
                      <small className="absolute bottom-3 bg-red-500 h-4 w-4 left-2 flex items-center justify-center text-sm rounded-full text-white">
                        {unreadLength}
                      </small>
                    )}
                  </div>
                  Notification
                </Link>
              </li>
            </ul>
            <ul>
              <li className="mb-4">
                <Link
                  to="/admin/profile"
                  className="flex items-center hover:bg-blue-700 p-2 rounded"
                >
                  <span
                    className="rounded-full overflow-hiiden border-2 mr-2"
                    style={{
                      height: "25px",
                      width: "25px",
                    }}
                  >
                    <img
                      src={avature}
                      alt="profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </span>{" "}
                  Profile
                </Link>
              </li>
              <li className="mb-4">
                <button
                  to="/admin/dashboard/room-booking-history"
                  className="flex items-center hover:bg-red-200 p-2 hover:text-red-700 rounded w-full "
                  onClick={logOut}
                >
                  <IoMdLogOut className="mr-2 text-xl " /> Logout
                </button>
              </li>
            </ul>
          </nav>
        </aside>
        <div className="md:hidden fixed flex bottom-0 left-0 bg-gray-800 backdrop-blur-md w-full justify-between p-2 ">
          <Link href="#home" className="block py-2 px-4 text-white ">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-full h-full"
            >
              <MdHome className="w-full h-full text-3xl" />
            </motion.div>
          </Link>
          <Link href="#rooms" className="block py-2 px-4 text-white ">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-full h-full"
            >
              <IoMdAddCircle className="w-full h-full text-3xl" />
            </motion.div>
          </Link>
          <Link href="#facilities" className="block py-2 px-4 text-white ">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-full h-full"
            >
              <MdContactSupport className="w-full h-full text-3xl" />
            </motion.div>
          </Link>
          <Link href="#booking" className="block py-2 px-4 text-white ">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-full h-full"
            >
              <MdContactSupport className="w-full h-full text-3xl" />
            </motion.div>
          </Link>
          <Link href="#contact" className="block py-2 px-4 text-white ">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-full h-full"
            >
              <MdContactSupport className="w-full h-full text-3xl" />
            </motion.div>
          </Link>
        </div>
        <main className="flex-1 w-full max-h-screen overflow-auto z-100">
          <div className="md:p-4 p-2 max-h-screen">
            {!(
              pathname === "/admin/login" ||
              pathname === "admin/password-verify"
            ) && children}
          </div>
        </main>
      </div>
    )
  );
};

export default AdminDashboard;
