import React, { useMemo, useContext, useEffect, useState } from "react";
import { useTable } from "react-table";
import { motion } from "framer-motion";
import { IoFilterSharp } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { RoomContext } from "../../../state/Room";
import { formatDate } from "../../../utils/extra";
import { useSelector } from "react-redux";
import DeleteModal from "../../../components/DeleteModal";
import { toast } from "react-toastify";
import { NotificationContext } from "../../../state/Notification";

const BookingReci = () => {
  const { bookingCancelledNotification } = useContext(NotificationContext);
  const { reciptionistId } = useSelector((state) => state.userAvatureReducer);
  const [userId, setUserId] = useState(reciptionistId);
  useEffect(() => {
    setUserId(reciptionistId);
  }, [reciptionistId]);
  const { getAllBokings, cancelBooking } = useContext(RoomContext);
  const [filter, setFilter] = useState("upcoming");
  const [bookingsHistory, setBookingsHistory] = useState({});
  const [bookingsFilter, setBookingFilter] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["getBookings"], // State ka parameter use kiya
    queryFn: getAllBokings,
  });

  useEffect(() => {
    if (data?.bookings && data.status) {
      setBookingsHistory(data?.bookings);
      setBookingFilter(data?.bookings[filter]);
    }
    return () => {
      setBookingsHistory({});
    };
  }, [data]);

  useEffect(() => {
    setBookingFilter(bookingsHistory[filter]);
  }, [filter]);
  const navigate = useNavigate();

  // Redirect to user profile
  const onRedirect = (id) => {
    navigate(`/receptionist/dashboard/guest-profile/${id}`);
  };

  const cancelBookingFunction = async (id) => {
    const response = await cancelBooking(id);
    const { status, message, data } = await response;
    if (status) {
      toast.success(message);
      setIsModalOpen(false);
      setBookingFilter(
        bookingsFilter?.filter((booking) => booking._id !== bookingId)
      );
      bookingCancelledNotification(data);
    } else {
      toast.error(message);
    }
    try {
    } catch (error) {
      console.log(error);
    }
  };

  // Define columns for the table
  const columns = useMemo(
    () => [
      { Header: "Name", accessor: "guestName" },
      { Header: "Email", accessor: "guestEmail" },
      { Header: "Room Number", accessor: "roomId.roomNumber" },
      { Header: "Room Type", accessor: "roomId.type" },
      {
        Header: "Check-in Date",
        accessor: "checkInDate",
        Cell: ({ row }) => {
          return formatDate(row.original.checkInDate);
        },
      },

      {
        Header: "Check-out Date",
        accessor: "checkOutDate",
        Cell: ({ row }) => {
          return formatDate(row.original.checkOutDate);
        },
      },
      {
        Header: "Number of Days",
        accessor: "numDays",
        Cell: ({ row }) => {
          const start = new Date(row.original.checkInDate);
          const end = new Date(row.original.checkOutDate);
          const diffTime = Math.abs(end - start);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return <span>{diffDays} days</span>;
        },
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full ${
              value === "completed"
                ? "bg-green-100 text-green-800"
                : value === "Booked"
                ? "bg-blue-100 text-blue-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {value}
          </span>
        ),
      },
      {
        Header: "Action",
        accessor: "guestId",
        Cell: ({ value, row }) => (
          <div className="flex gap-2">
            {
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={() => {
                  onRedirect(value);
                }}
                className="bg-blue-200 text-blue-700 px-2 rounded-sm"
              >
                View
              </motion.button>
            }
            {
              <motion.button
                whileTap={{ scale: 0.8 }}
                className="bg-red-200 text-red-700 rounded-sm px-2"
                onClick={() => {
                  setBookingId(row.original._id);
                  setIsModalOpen(true);
                }}
              >
                Cancel
              </motion.button>
            }
          </div>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: bookingsFilter || [] });

  return (
    !isLoading && (
      <div className="flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden w-full "
        >
          {/* Table Header */}
          <div className="p-4 border-b bg-white relative">
            <div className="w-full max-w-4xl flaot-rigth absolute top-10 md:left-2 left-0 ">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-blue-600 hover:text-blue-800 transition duration-300 mb-4"
              >
                <FaArrowLeft className="w-5 h-5 mr-2" />
                <span className="text-lg font-semibold">Back</span>
              </button>
            </div>
            <h2 className="text-2xl font-bold">Booking History</h2>
            <p className="text-gray-600">
              View the booking history of the hotel guests.
            </p>

            {/* Filter Navigation */}
            <div className="w-full flex justify-between ">
              <div className="p-2 w-auto flex justify-start items-start gap-2">
                {["upcoming", "current", "completed", "cancelled"].map(
                  (item) => (
                    <button
                      key={item}
                      onClick={() => setFilter(item)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        filter === item
                          ? "bg-blue-500 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </button>
                  )
                )}
              </div>
              <motion.div
                className="flex justify-between items-center py-2 mt-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span
                  className="flex  items-center mb-4 bg-gray-100 min-w-40 max-w-4xl cursor-pointer px-4 py-2 rounded-lg shadow-md"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <IoFilterSharp className="mr-2" />
                  Filter by
                  <select className="ml-2 bg-gray-100 cursor-pointer outline-none">
                    <option value="">RoonNo</option>
                    {Array.from({ length: 100 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  And
                  <input
                    type="month"
                    className="ml-2 bg-gray-100 cursor-pointer outline-none"
                    placeholder="Month"
                  />
                </span>
              </motion.div>
            </div>
          </div>

          {/* Booking History Table */}
          <div className="overflow-x-auto">
            <table
              {...getTableProps()}
              className="table-auto w-full text-left border-collapse border border-gray-300"
            >
              <thead className="bg-gray-100">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps()}
                        className="px-4 py-2 border border-gray-300"
                      >
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <motion.tbody {...getTableBodyProps()} className="bg-white">
                {rows.map((row) => {
                  prepareRow(row);
                  return (
                    <motion.tr
                      {...row.getRowProps()}
                      className="hover:bg-gray-100"
                    >
                      {row.cells.map((cell) => (
                        <motion.td
                          {...cell.getCellProps()}
                          className="px-4 py-2 border border-gray-300"
                        >
                          {cell.render("Cell")}
                        </motion.td>
                      ))}
                    </motion.tr>
                  );
                })}
              </motion.tbody>
            </table>
          </div>
        </motion.div>
        {isModalOpen && (
          <DeleteModal
            onClose={setIsModalOpen}
            onConfirm={cancelBookingFunction}
            id={bookingId}
            content="cancel this booking?"
          />
        )}
      </div>
    )
  );
};

export default BookingReci;
