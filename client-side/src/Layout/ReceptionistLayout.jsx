import { motion } from "framer-motion";
import { FiSearch, FiBell } from "react-icons/fi";
import Authentication from "./Authentication";
import { staff_token } from "../utils/extra";
import { UserContext } from "../state/User";

import {
  FaHistory,
  FaHome,
  FaUsers,
  FaHotel,
  FaMoneyBill,
  FaChartLine,
} from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";

//redux
import { actionCreator } from "../redux";
import { bindActionCreators } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const sidebarVariants = {
  open: { width: 250 },
  closed: { width: 60 },
};

import { useEffect, useContext } from "react";

export default function ReceptionistLayout({ children }) {
  const dispatch = useDispatch();
  const action = bindActionCreators(actionCreator, dispatch);
  const { getEmpAvatueAndId } = useContext(UserContext);
  const { isStaffLogged } = useSelector((state) => state.isLoggedReducer);
  const { unreadLength } = useSelector((state) => state?.notificationReducer);
  const staffToken = staff_token();
  const navigate = useNavigate();

  useEffect(() => {
    if (!staffToken && !isStaffLogged) {
      navigate("/receptionist/dashboard/login");
    }
  }, [staffToken, isStaffLogged]);

  const getAvature = async () => {
    if (isStaffLogged) {
      const data = await getEmpAvatueAndId();
      if (data?.status) {
        action.setReciptionistAvatuer(data.avature, data.id);
      } else {
        toast.error(data?.message);
      }
    }
  };
  useEffect(() => {
    getAvature();
  }, [isStaffLogged]);

  const { reciptionistAvature: avature } = useSelector(
    (state) => state.userAvatureReducer
  );

  const logOut = async () => {
    localStorage.removeItem("authentication_staff_token");
    action.Stafflogout();
    toast.error("Logout Successfully");
    navigate("/receptionist/dashboard/login");
  };

  return !isStaffLogged ? (
    <Authentication>{children}</Authentication>
  ) : (
    <div className="flex h-screen bg-gray-50">
      <motion.aside
        initial="closed"
        animate="open"
        variants={sidebarVariants}
        className="hidden w-68 bg-blue-600  shadow-lg text-white md:flex flex-col px-4 space-y-6 h-screen overflow-auto"
      >
        <h1 className=" px-4 text-start text-2xl font-bold sticky top-0 mt-10 bg-blue-600 ">
          Sunshine Hotel
        </h1>
        <nav className="flex flex-col justify-between h-screen">
          <ul className="space-y-4">
            <li className="mb-4">
              <Link
                to="/receptionist/dashboard"
                className="flex items-center hover:bg-blue-700 p-2 rounded"
              >
                <FaHome className="mr-2" /> Dashboard
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/receptionist/dashboard/rooms"
                className="flex items-center hover:bg-blue-700 p-2 rounded"
              >
                <FaHotel className="mr-2" /> Rooms
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/receptionist/dashboard/guests"
                className="flex items-center hover:bg-blue-700 p-2 rounded"
              >
                <FaUsers className="mr-2" /> Guests
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/billing"
                className="flex items-center hover:bg-blue-700 p-2 rounded"
              >
                <FaMoneyBill className="mr-2" /> Billing
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/receptionist/dashboard/reports"
                className="flex items-center hover:bg-blue-700 p-2 rounded"
              >
                <FaChartLine className="mr-2" /> Reports
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/receptionist/dashboard/bookings"
                className="flex items-center hover:bg-blue-700 p-2 rounded"
              >
                <FaHistory className="mr-2" /> Bookings
              </Link>
            </li>
          </ul>
          <ul>
            <li className="mb-4">
              <Link
                to="/receptionist/dashboard/profile"
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
                </span>
                Profile
              </Link>
            </li>
            <li className="mb-4">
              <button
                to="/admin/dashboard/room-booking-history"
                className="flex items-center hover:bg-red-200 hover:text-red-600 p-2 rounded w-full "
                onClick={logOut}
              >
                <IoMdLogOut className="mr-2 text-xl " />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0">
          <div className="flex items-center gap-2">
            {/* <FiSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="outline-none bg-transparent"
            /> */}
          </div>
          <Link to="/receptionist/dashboard/notification">
            <div className="flex items-center gap-2 relative">
              <FiBell className="text-xl cursor-pointer" />
              {unreadLength !== 0 && (
                <small className="absolute bottom-3 bg-red-500 h-4 w-4 left-2 flex items-center justify-center text-sm rounded-full text-white">
                  {unreadLength}
                </small>
              )}
            </div>
          </Link>
        </header>

        {/* Page Content */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="md:p-8 p-2 max-h-screen"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
