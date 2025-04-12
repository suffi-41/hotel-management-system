import React, {
  useState,
  useMemo,
  lazy,
  Suspense,
  useContext,
  useEffect,
  startTransition,
  useCallback,
} from "react";
import { toast } from "react-toastify";

const Edit = lazy(() => import("../../Admin/room/component/Edit"));
const DeleteModal = lazy(() => import("../../../components/DeleteModal"));
const Add = lazy(() => import("../../Admin/room/component/Add"));

import { RoomContext } from "../../../state/Room";

import { actionCreator } from "../../../redux";
import { bindActionCreators } from "redux";
import { useDispatch, useSelector } from "react-redux";

import { FiCalendar, FiUser, FiHome, FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  FaPlus,
  FaEdit,
  FaBed,
  FaDoorOpen,
  FaTools,
  FaTrash,
} from "react-icons/fa";
import { TbHistory } from "react-icons/tb";
import { GoEye } from "react-icons/go";

const Room = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const action = bindActionCreators(actionCreator, dispatch);
  const { SetCurrentRoom, SetRooms, DeleteRoom } = action;
  const {
    getRoomAvaibility,
    getCurrentGuest: getCurrentBookings,
    roomDetialsFunction,
    roomDetialsUpdateFunction,
    addRoomImages,
    deleteRoom,
  } = useContext(RoomContext);
  const [date, setDate] = useState(new Date().toDateString());

  // State
  const [editRoomModal, setEditRoomModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [currentRoomId, setCureentRooomId] = useState(null);

  const [rooms, setRooms] = useState([]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["getRoomAvaibility", date],
    queryFn: () => getRoomAvaibility(date),
  });

  useEffect(() => {
    if (data?.status) {
      setRooms(data?.rooms);
    }
    return () => {
      setRooms([]);
    };
  }, [data]);

  useEffect(() => {
    refetch();
    console.log(date);
  }, [date]);

  const [bookings, setBookings] = useState([]);

  const { data: cureentBooking, isLoading: currentBookindDataIsLoadding } =
    useQuery({
      queryKey: ["getCurrentBookings"], // State ka parameter use kiya
      queryFn: () => getCurrentBookings(),
    });

  useEffect(() => {
    if (cureentBooking?.status) {
      setBookings(cureentBooking?.data);
    }
    return () => {
      setBookings([]);
    };
  }, [cureentBooking]);

  const handleEdit = (id) => {
    startTransition(() => {
      //store current room data in redux store
      setCureentRooomId(id);
      //open edit modal
      setEditRoomModal(true);
    });
  };
  const handleDelete = (id) => {
    startTransition(async () => {
      setCureentRooomId(id);
      setIsOpenDeleteModal(true);
    });
  };

  const onConfirmDelete = async (id) => {
    const response = await deleteRoom(id);
    const { status, message } = await response;
    if (status) {
      toast.success(message);
      refetch();
      setIsOpenDeleteModal(false);
    } else {
      toast.error(message);
    }
  };

  return (
    <div className="bg-gray-50 px-8">
      {/* Overview Cards */}
      <section
        id="overview"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5"
      >
        {/* Total Rooms */}
        <div className="bg-white p-4 shadow-md rounded-lg flex items-center">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <FaBed className="text-blue-500 text-2xl" />{" "}
            {/* Icon for Total Rooms */}
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">Total Rooms</h3>
            <p className="text-2xl">{data?.rooms?.length}</p>
          </div>
        </div>

        {/* Occupied Rooms */}
        <div className="bg-white p-4 shadow-md rounded-lg flex items-center">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <FaDoorOpen className="text-green-500 text-2xl" />{" "}
            {/* Icon for Occupied Rooms */}
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">Occupied Rooms</h3>
            <p className="text-2xl">
              {data?.rooms?.filter((room) => room.status === "occupied").length}
            </p>
          </div>
        </div>

        {/* Available Rooms */}
        <div className="bg-white p-4 shadow-md rounded-lg flex items-center">
          <div className="bg-purple-100 p-3 rounded-full mr-4">
            <FaBed className="text-purple-500 text-2xl" />{" "}
            {/* Icon for Available Rooms */}
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">Available Rooms</h3>
            <p className="text-2xl">
              {
                data?.rooms?.filter((room) => room.status === "available")
                  .length
              }
            </p>
          </div>
        </div>

        {/* Maintenance Rooms */}
        <div className="bg-white p-4 shadow-md rounded-lg flex items-center">
          <div className="bg-yellow-100 p-3 rounded-full mr-4">
            <FaTools className="text-yellow-500 text-2xl" />{" "}
            {/* Icon for Maintenance Rooms */}
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">Maintenance</h3>
            <p className="text-2xl">
              {
                data?.rooms?.filter((room) => room.status === "maintenance")
                  .length
              }
            </p>
          </div>
        </div>
      </section>

      <div className="flex justify-between items-center mb-4">
        <div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-field w-full py-2 px-4 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <button
          className="flex items-center  px-4 py-2 rounded-lg shadow-md max-w-60"
          onClick={() => setAddModal(!addModal)}
        >
          Add Room
        </button>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {!isLoading && data?.rooms
          ? rooms.map((room) => (
              <motion.div
                key={room._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-lg shadow-sm relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">
                      Room {room.roomNumber}
                    </h3>
                    <p className="text-gray-600">{room.type}</p>
                    <p className="text-blue-600 font-semibold">
                      ${room.price}/night
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      room.status === "available"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {room.status}
                  </span>
                </div>
                <div className="flex itmes-center justify-between w-full">
                  <div className="cursor-pointer flex gap-2 p-2">
                    <Link
                      to={`/admin/dashboard/rooms/${room._id}`}
                      className="bg-blue-200 text-blue-800 p-1 rounded-md"
                    >
                      <GoEye />
                    </Link>
                    <Link
                      to={`/admin/dashboard/rooms/history/${room._id}`}
                      className="bg-blue-200 text-blue-800 p-1 rounded-md"
                    >
                      <TbHistory />
                    </Link>

                    <span
                      className="bg-green-200 text-green-800 p-1 rounded-md"
                      onClick={() => handleEdit(room._id)}
                    >
                      <FaEdit />
                    </span>

                    <span
                      className="bg-red-200 text-red-800 p-1 rounded-md"
                      onClick={() => handleDelete(room._id)}
                    >
                      <FaTrash />
                    </span>
                  </div>
                  {room.status === "available" && (
                    <Link
                      to={`/receptionist/dashboard/bookings/booking-room/${room._id}`}
                      state={{
                        roomNumber: room.roomNumber,
                        capacity: room.capacity,
                        roomPrice: room.price,
                      }}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      <FiCalendar /> Book Now
                    </Link>
                  )}
                </div>
              </motion.div>
            ))
          : Array(5)
              .fill()
              .map((_, index) => <SkeletonRoomCard key={index} />)}
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <FiCheckCircle /> Current Bookings
        </h2>

        <div className="space-y-2">
          {cureentBooking && !currentBookindDataIsLoadding
            ? bookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b pb-2"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{booking.guestName}</h4>
                      <p className="text-sm text-gray-600">
                        Room No :{" "}
                        <b>
                          {booking.roomId?.roomNumber} •
                          {new Date(booking.checkInDate).toLocaleDateString()}{" "}
                          to
                          {new Date(booking.checkOutDate).toLocaleDateString()}
                        </b>
                      </p>
                    </div>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {"Confirmed"}
                    </span>
                  </div>
                </motion.div>
              ))
            : Array(5)
                .fill(0)
                .map((_, index) => <BookingSkeleton key={index} />)}
        </div>
      </div>
      {/* Modals */}
      <Suspense fallback={<div>Loadding</div>}>
        {addModal && <Add closeModal={setAddModal}  />}
        {editRoomModal && (
          <Edit
            closeModal={setEditRoomModal}
            updateFunction={roomDetialsUpdateFunction}
            addRoomImages={addRoomImages}
            id={currentRoomId}
            refresh={refetch}
          />
        )}
        {isOpenDeleteModal && (
          <DeleteModal
            onClose={setIsOpenDeleteModal}
            onConfirm={onConfirmDelete}
            id={currentRoomId}
          />
        )}
      </Suspense>
    </div>
  );
};

const SkeletonRoomCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white p-6 rounded-lg shadow-sm"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        {/* Room Number Skeleton */}
        <Skeleton
          width="25%"
          height={24}
          className="mb-2"
          baseColor="#f3f4f6"
          highlightColor="#e5e7eb"
        />

        {/* Room Type Skeleton */}
        <Skeleton
          width="33%"
          height={16}
          className="mb-1"
          baseColor="#f3f4f6"
          highlightColor="#e5e7eb"
        />

        {/* Price Skeleton */}
        <Skeleton
          width="50%"
          height={20}
          baseColor="#f3f4f6"
          highlightColor="#e5e7eb"
        />
      </div>

      {/* Status Badge Skeleton */}
      <Skeleton
        width={80}
        height={24}
        borderRadius={9999}
        baseColor="#f3f4f6"
        highlightColor="#e5e7eb"
      />
    </div>

    {/* Book Button Skeleton */}
    <Skeleton
      height={40}
      borderRadius={8}
      baseColor="#f3f4f6"
      highlightColor="#e5e7eb"
    />
  </motion.div>
);

const BookingSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="border-b pb-2"
  >
    <div className="flex justify-between items-center">
      <div className="flex-1">
        <div className="mb-2">
          <Skeleton
            width="40%"
            height={20}
            baseColor="#f3f4f6"
            highlightColor="#e5e7eb"
          />
        </div>
        <div className="space-y-1">
          <Skeleton
            width="60%"
            height={16}
            baseColor="#f3f4f6"
            highlightColor="#e5e7eb"
          />
          <Skeleton
            width="50%"
            height={16}
            baseColor="#f3f4f6"
            highlightColor="#e5e7eb"
          />
        </div>
      </div>
      <div>
        <Skeleton
          width={80}
          height={24}
          borderRadius={9999}
          baseColor="#f3f4f6"
          highlightColor="#e5e7eb"
        />
      </div>
    </div>
  </motion.div>
);

export default Room;
