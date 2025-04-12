import { motion, AnimatePresence } from "framer-motion";
import {
  FaUser,
  FaBed,
  FaBell,
  FaUtensils,
  FaBroom,
  FaCreditCard,
  FaWifi,
  FaChartLine,
} from "react-icons/fa";
import { GiExitDoor } from "react-icons/gi";
import { formatDate } from "../../utils/extra";
import { useState } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { toast } from "react-toastify";
import Skeleton from "react-loading-skeleton";
import { Line, Bar, Pie } from "react-chartjs-2";
import React, { useContext, useEffect, useMemo } from "react";
import { UserContext } from "../../state/User";
import { RoomContext } from "../../state/Room";

import { useSelector } from "react-redux";

import { useQuery, useQueries } from "@tanstack/react-query";
// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);

const ReceptionistDashborad = () => {
  const {
    getAllCheckIn,
    getAllCheckOut,
    getAllBookings,
    getCurrentGuest,
    getRoomStatus,
    getRoomTypeGroupOfSum,
    getOccupancyTred,
  } = useContext(RoomContext);

  const {
    data: roomStautsdData,
    isLoading: isFetching,
    error: isError,
  } = useQuery({
    queryKey: ["room-status"],
    queryFn: getRoomStatus,
  });
 
  const [roomStatus, setRoomStatus] = useState([]);
  useEffect(() => {
    if (roomStautsdData?.data) {
      roomStautsdData.data?.forEach((item) => {
        if (item.status === "maintenance") {
          item?.rooms.forEach((subItem) => {
            subItem.isBookedToday = "maintenance";
            setRoomStatus((pre) => [...pre, subItem]);
          });
        } else {
          item?.rooms.forEach((subItem) => {
            setRoomStatus((pre) => [...pre, subItem]);
          });
        }
      });
    }
    return () => {
      setRoomStatus([]);
    };
  }, [roomStautsdData]);

  const { data: roomTypeGroupOfSumData, isLoading: isFetchingRoomstatus } =
    useQuery({
      queryKey: ["room-type-group-of-sum"],
      queryFn: getRoomTypeGroupOfSum,
    });

  const { data, isLoading, error } = useQuery({
    queryKey: ["parallel-execution-example"],
    queryFn: async () => {
      const [cureentGuest, checkinLength, checkoutLength, allbookingLength] =
        await Promise.all([
          // current guest details function
          getCurrentGuest(),
          //bookings details function
          getAllCheckIn(),
          getAllCheckOut(),
          getAllBookings(),
        ]);
      return {
        cureentGuest,
        checkinLength,
        checkoutLength,
        allbookingLength,
      };
    },
  });

  const { cureentGuest, checkinLength, checkoutLength, allbookingLength } =
    data || {};

  const [checkin, checkout, allbooking, cureentGuestlength] = [
    checkinLength?.data,
    checkoutLength?.data,
    allbookingLength?.data,
    cureentGuest?.data?.length || "no any guest",
  ];

  // const { data: occupancyTredData, isLoading: isLoaddingOccupancy } = useQuery({
  //   queryKey: ["getOccupancyTred"],
  //   queryFn: getOccupancyTred,
  // });

  useEffect(() => {
    if (!checkinLength?.status) {
      toast.error(checkinLength?.message);
    }
    if (!checkoutLength?.status) {
      toast.error(checkoutLength?.message);
    }
    if (!allbookingLength?.status) {
      toast.error(allbookingLength?.message);
    }
    if (!roomStautsdData?.status) {
      toast.error(roomStautsdData?.message);
    }
    if (!roomTypeGroupOfSumData?.status) {
      toast.error(roomTypeGroupOfSumData?.message);
    }
  }, []);


  // const [lablesOccupancy, setLablesOccupancy] = useState([]);
  // const [dataOccupancy, setDataOccupancy] = useState([]);

  // useEffect(() => {
  //   if (occupancyTredData?.data) {
  //     occupancyTredData.data.forEach((item) => {
  //       setLablesOccupancy((pre) => [...pre, item.dayName]);
  //       setDataOccupancy((pre) => [...pre, item.occupiedRooms]);
  //     });
  //   }
  //   return () => {
  //     setLablesOccupancy([]);
  //     setDataOccupancy([]);
  //   };
  // }, [occupancyTredData]);

  const occupancyData = useMemo(() => {
    return {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Occupancy Rate (%)",
          data: [10, 30, 50, 60, 70, 80, 90, 100],
          borderColor: "#3B82F6",
          backgroundColor: "#3B82F610",
          tension: 0.4,
        },
      ],
    };
  }, []);

  const revenueData = {
    labels: ["Rooms", "Dining", "Spa", "Other"],
    datasets: [
      {
        label: "Revenue ($)",
        data: [12000, 4500, 2800, 1500],
        backgroundColor: ["#3B82F6", "#10B981", "#6366F1", "#F59E0B"],
        borderWidth: 0,
      },
    ],
  };
  const [labels, setLabels] = useState([]);
  const [roomTData, setRoomTData] = useState([]);

  // Use useEffect for side effects instead of useMemo
  useEffect(() => {
    if (roomTypeGroupOfSumData?.data) {
      roomTypeGroupOfSumData.data.forEach((item) => {
        setLabels((pre) => [...pre, item.type]);
        setRoomTData((pre) => [...pre, item.totalRooms]);
      });
    }
    return () => {
      setLabels([]);
      setRoomTData([]);
    };
  }, [roomTypeGroupOfSumData]); // Only run when data changes

  const roomTypeData = useMemo(
    () => ({
      labels: labels,
      datasets: [
        {
          data: roomTData,
          backgroundColor: ["#3B82F6", "#10B981", "#6366F1"],
          borderWidth: 1,
        },
      ],
    }),
    [labels, roomTData]
  ); // Recomputed when labels or data change

  const services = [
    { type: "Room Service", time: "19:30", status: "pending" },
    { type: "Wake-up Call", time: "07:00", status: "completed" },
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* ... (Keep previous header and stats cards code) ... */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800">Hotel Dashboard</h1>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search guest or room..."
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cureentGuestlength ? (
            <StatCard
              icon={<FaUser />}
              title="Current Guests"
              value={cureentGuestlength || 0}
            />
          ) : (
            <StatCardSkeleton />
          )}
          {allbooking ? (
            <StatCard
              icon={<FaBed />}
              title="Occupied Rooms"
              value={allbooking}
            />
          ) : (
            <StatCardSkeleton />
          )}
          {checkin ? (
            <StatCard
              icon={<GiExitDoor />}
              title="Check-in Today"
              value={checkin}
            />
          ) : (
            <StatCardSkeleton />
          )}
          {checkout ? (
            <StatCard
              icon={<GiExitDoor />}
              title="Check-out Today"
              value={checkout}
            />
          ) : (
            <StatCardSkeleton />
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Guest Overview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaUser className="mr-2 text-blue-500" /> Current Guests
            </h2>
            <div className="space-y-4">
              {cureentGuest?.data?.length != 0
                ? cureentGuest?.data
                  ? cureentGuest.data.map((guest) => (
                      <div
                        key={guest.id}
                        className="p-4 bg-gray-50 rounded-lg flex justify-between items-center"
                      >
                        <div>
                          <h3 className="font-medium">{guest.guestName}</h3>
                          <p className="text-sm text-gray-500">
                            <h3 className="font-medium inline">Room No</h3> :
                            {guest.roomId?.roomNumber}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <span className="bg-green-100 text-blue-800 px-3  rounded-full text-sm">
                            {formatDate(guest.checkInDate)}
                          </span>
                          <span className="bg-red-100 text-blue-800 px-3  rounded-full text-sm">
                            {formatDate(guest.checkOutDate)}
                          </span>
                        </div>
                      </div>
                    ))
                  : Array(4)
                      .fill()
                      .map((_, index) => <GuestSkeleton key={index} />)
                : "No any current guests"}
            </div>
          </motion.div>

          {/* Room Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaBed className="mr-2 text-green-500" /> Room Status
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {roomStatus && !isFetching
                ? roomStatus.map((room) => (
                    <div
                      key={room?.roomNumber}
                      className={`p-4 rounded-lg ${
                        room?.isBookedToday === false
                          ? "bg-green-100"
                          : room?.isBookedToday === "maintenance"
                          ? "bg-red-100"
                          : "bg-yellow-100"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">
                          Room {room.roomNumber}
                        </span>
                        <span className="text-sm capitalize">
                          {room?.status?.replace("-", " ")}
                        </span>
                      </div>
                      <div className="mt-2 h-2 bg-white rounded-full">
                        <motion.div
                          className={`h-full rounded-full ${
                            room.isBookedToday === false
                              ? "bg-green-500"
                              : room.isBookedToday === "maintenance"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                        />
                      </div>
                    </div>
                  ))
                : Array(5)
                    .fill()
                    .map((_, index) => <RoomSkeleton key={index} />)}
            </div>
          </motion.div>
        </div>
        {/* Visualization Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Occupancy Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaChartLine className="mr-2 text-blue-500" /> Occupancy Trend
            </h2>
            <div className="h-64">
              <Line
                data={occupancyData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "top" },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: { display: true, text: "Occupancy (%)" },
                    },
                  },
                }}
              />
            </div>
          </motion.div>

          {/* Revenue Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaCreditCard className="mr-2 text-green-500" /> Revenue Breakdown
            </h2>
            <div className="h-64">
              <Bar
                data={revenueData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "top" },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: { display: true, text: "Amount ($)" },
                    },
                  },
                }}
              />
            </div>
          </motion.div>

          {/* Room Type Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaBed className="mr-2 text-purple-500" /> Room Type Distribution
            </h2>
            <div className="h-64">
              <Pie
                data={roomTypeData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "right" },
                  },
                }}
              />
            </div>
          </motion.div>

          {/* Service Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaUtensils className="mr-2 text-red-500" /> Service Performance
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Room Service Response Time</span>
                <span className="font-semibold text-green-500">8.2 min</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Housekeeping Efficiency</span>
                <span className="font-semibold text-green-500">94%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Guest Satisfaction</span>
                <span className="font-semibold text-green-500">4.8 ★</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Services & Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaBell className="mr-2 text-red-500" /> Active Services
            </h2>
            <div className="space-y-4">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <FaUtensils className="mr-3 text-gray-600" />
                    <span>{service.type}</span>
                  </div>
                  <span className="text-sm text-gray-500">{service.time}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-sm"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaCreditCard className="mr-2 text-purple-500" /> Billing Overview
            </h2>
            <div className="space-y-4">
              <div className="bg-purple-100 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span>Current Billing Cycle</span>
                  <span>65%</span>
                </div>
                <div className="h-2 bg-white rounded-full">
                  <motion.div
                    className="h-full bg-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "65%" }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ icon, title, value }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white p-6 rounded-xl shadow-sm flex items-center"
  >
    <div className="p-3 bg-blue-100 rounded-lg mr-4">{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p
        className={
          typeof value == "string"
            ? "text-small font-bold"
            : "text-2xl font-bold"
        }
      >
        {value}
      </p>
    </div>
  </motion.div>
);

const StatCardSkeleton = () => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white p-6 rounded-xl shadow-sm flex items-center"
  >
    {/* Icon Skeleton */}
    <div className="mr-4">
      <Skeleton
        circle
        width={48}
        height={48}
        baseColor="#f3f4f6"
        highlightColor="#e5e7eb"
      />
    </div>

    {/* Text Content Skeleton */}
    <div className="flex-1">
      <Skeleton
        width={60}
        height={16}
        baseColor="#f3f4f6"
        highlightColor="#e5e7eb"
        className="mb-2"
      />
      <Skeleton
        width={80}
        height={32}
        baseColor="#f3f4f6"
        highlightColor="#e5e7eb"
      />
    </div>
  </motion.div>
);

const GuestSkeleton = () => (
  <div className="p-4 bg-gray-50 rounded-lg flex justify-between items-center">
    <div className="flex-1">
      <Skeleton
        width={120}
        height={20}
        baseColor="#f3f4f6"
        highlightColor="#e5e7eb"
        className="mb-2"
      />
      <Skeleton
        width={80}
        height={16}
        baseColor="#f3f4f6"
        highlightColor="#e5e7eb"
      />
    </div>
    <Skeleton
      width={80}
      height={24}
      baseColor="#f3f4f6"
      highlightColor="#e5e7eb"
      style={{ borderRadius: "9999px" }}
    />
  </div>
);

const RoomSkeleton = () => (
  <div className="p-4 rounded-lg bg-gray-100">
    <div className="flex justify-between items-center">
      <Skeleton
        width={100}
        height={20}
        baseColor="#f3f4f6"
        highlightColor="#e5e7eb"
      />
      <Skeleton
        width={80}
        height={16}
        baseColor="#f3f4f6"
        highlightColor="#e5e7eb"
      />
    </div>
    <div className="mt-2 h-2 bg-white rounded-full">
      <Skeleton
        width="100%"
        height={8}
        baseColor="#f3f4f6"
        highlightColor="#e5e7eb"
        className="rounded-full"
      />
    </div>
  </div>
);

export default ReceptionistDashborad;
