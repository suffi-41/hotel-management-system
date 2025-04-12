import React, { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { FaEdit, FaHistory } from "react-icons/fa";
import { UserContext } from "../../../state/User";
import { toast } from "react-toastify";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
//redux

import { actionCreator } from "../../../redux/index";
import { bindActionCreators } from "redux";
import { useDispatch } from "react-redux";

const GuestProfile = () => {
  const dispatch = useDispatch();
  const action = bindActionCreators(actionCreator, dispatch);
  const { id } = useParams();

  //user context function
  const { getUserById } = useContext(UserContext);
  const { data, isLoading, error } = useQuery({
    queryKey: ["fetchRooms", id], // State ka parameter use kiya
    queryFn: () => getUserById(id),
  });

  const [user, setUser] = useState(null);
  useEffect(() => {
    if (data?.status) {
      setUser(data.user);
    } else {
      toast.error(data?.message);
    }
    return () => {
      setUser(null);
    };
  }, [data]);
  //state
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingDateOfBirth, setIsEditingDateOfBirth] = useState(false);
  const [isEditingGender, setIsEditingGender] = useState(false);

  function formatDate(isoDate) {
    let date = new Date(isoDate);
    let day = String(date.getDate()).padStart(2, "0");
    let month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    let year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  return (
    !isLoading && (
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full mx-auto p-6 bg-white"
      >
        {/* Profile Image and Name Section */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-r from-blue-400 to-blue-200 p-6 rounded-lg flex justify-between items-center"
        >
          <div className="flex items-center  gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border border-white">
              <img
                src={user?.avature || ""}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Name</h3>
              <p className="text-white">{user?.name}</p>
            </div>
          </div>
          <Link
            to={`/receptionist/dashboard/booking-history/${id}`}
            title="Booking history"
            className="text-white cursor-pointer text-2xl "
          >
            <FaHistory />
          </Link>
        </motion.div>

        {/* Email Section */}
        <div className="text-start mt-4 bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="text-gray-700 font-semibold">Email</h3>
            <p className="text-gray-600">
              {user?.email}
              <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                VERIFIED
              </span>
            </p>
          </div>
        </div>
        {/* Phone Section */}

        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 border-b flex justify-between"
        >
          <div>
            <h3 className="text-gray-700 font-semibold">Phone number</h3>
            <p className="text-gray-600">
              {user?.phoneNumber || "Not provided"}
            </p>
          </div>
        </motion.div>

        {/* Password Section */}

        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 flex justify-between"
        >
          <div>
            <h3 className="text-gray-700 font-semibold">Password</h3>
            <p className="text-gray-600">{user?.password || "***********"}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 border-b flex justify-between"
        >
          <div>
            <h3 className="text-gray-700 font-semibold">Gender</h3>
            <p className="text-gray-600">{user?.gender || "Not specified"}</p>
          </div>
        </motion.div>

        {/* Date of Birth */}

        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 border-b flex justify-between"
        >
          <div>
            <h3 className="text-gray-700 font-semibold">Date of Birth</h3>
            <p className="text-gray-600">
              {user?.dateOfBirth
                ? formatDate(user?.dateOfBirth)
                : "Not provided"}
            </p>
          </div>
        </motion.div>

        {/* Address */}

        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 border-b flex justify-between"
        >
          <div>
            <h3 className="text-gray-700 font-semibold">Address</h3>
            <p className="text-gray-600">
              {user?.address?.street
                ? `${user?.address.street}, ${user?.address.city}, ${user?.address.state}, ${user?.address.zipCode}, ${user?.address.country}`
                : "Not provided"}
            </p>
          </div>
          <FaEdit
            className="text-gray-700 font-semibold cursor-pointer"
            onClick={() => setIsEditingAddress(true)}
          />
        </motion.div>
      </motion.div>
    )
  );
};
export default GuestProfile;
