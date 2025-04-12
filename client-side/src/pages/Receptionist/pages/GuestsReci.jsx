import { useState, useContext, useEffect } from "react";
import { FiUser, FiPlus, FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import { RoomContext } from "../../../state/Room";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { formatDate } from "../../../utils/extra";
import Skeleton from "react-loading-skeleton";
import { IoMdRefresh } from "react-icons/io";

const GuestsReci = () => {
  const [activeTab, setActiveTab] = useState("checkIn");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    getAllBookedRoomGuests,
    checkedInVisitedStatus,
    checkedOutVisitedStatus,
  } = useContext(RoomContext);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["getAllBookedRoomGuests", searchQuery],
    queryFn: () => getAllBookedRoomGuests(searchQuery),
  });
  const [guests, setGuests] = useState([]);

  useEffect(() => {
    if (!data?.status) {
      toast.error(data?.message);
    }
    if (data?.status) {
      setGuests(data?.guestBookings);
    }
  }, [data]);
  console.log(data);

  useEffect(() => {
    refetch();
  }, [setSearchQuery]);

  const handleCheckIn = async (id) => {
    const response = await checkedInVisitedStatus(id);
    if (response?.status) {
      toast.success(response?.message);
      refetch();
    } else {
      toast.error(response?.message);
    }
  };

  const handleCheckOut = async (id) => {
    const response = await checkedOutVisitedStatus(id);
    if (response?.status) {
      toast.success(response?.message);
      refetch();
    } else {
      toast.error(response?.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Guest Management</h1>
        <motion.div
          className="flex items-center space-x-2 bg-white rounded-full shadow-lg text-xl p-2"
          whileTap={{ rotate: 360 }}
          transition={{ duration: 0.2 }}
          onClick={refetch}
        >
          <IoMdRefresh className="text-gray-500 cursor-pointer bold" />
        </motion.div>
      </div>
      <div className="mb-6 relative max-w-md shadow-md">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search guests by name or email or phone ..."
          className="w-full pl-10 pr-4  text-start py-2  rounded-sm  outline-none  "
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Search Bar */}

      {/* Tabs */}
      <div className="flex border-b mb-6">
        {["checkIn", "currentGuests", "checkOut"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === tab
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "checkIn" && "New checkIn"}
            {tab === "currentGuests" && "In-Hotel Guests"}
            {tab === "checkOut" && "check Out"}
          </button>
        ))}
      </div>

      {/* Table */}
      {!isLoading && data ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4">Guest</th>
                {activeTab === "checkIn" && (
                  <th className="text-left p-4">Reservation Code</th>
                )}
                {activeTab === "currentGuests" && (
                  <th className="text-left p-4">Room</th>
                )}
                <th className="text-left p-4">
                  {activeTab === "checkIn" ? "Check-In" : "Check-Out"}
                </th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {guests[activeTab]?.length !== 0 ? (
                guests[activeTab]?.map((guest) => (
                  <tr
                    key={guest.id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 font-medium text-start">
                      {guest.guestName}
                    </td>

                    {activeTab === "checkIn" && (
                      <td className="p-4 text-gray-600 text-start">
                        {guest._id}
                      </td>
                    )}

                    {activeTab === "currentGuests" && (
                      <td className="p-4 text-gray-600 text-start">
                        {guest.roomId?.roomNumber}
                      </td>
                    )}

                    <td className="p-4 text-gray-600 text-start">
                      {activeTab === "checkIn"
                        ? formatDate(guest.checkInDate)
                        : formatDate(guest.checkOutDate)}
                    </td>

                    <td className="p-4 text-start">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                          guest.status === "booked"
                            ? "bg-green-100 text-green-800"
                            : guest.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {guest.status}
                      </span>
                    </td>

                    <td className="p-4 space-x-2 flex gap-2">
                      <button className="text-blue-500 hover:text-blue-700">
                        Details
                      </button>
                      {activeTab === "checkIn" && (
                        <button
                          className="text-green-500 hover:text-green-700"
                          onClick={() => handleCheckIn(guest._id)}
                        >
                          Check In
                        </button>
                      )}
                      {activeTab === "currentGuests" && (
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleCheckOut(guest._id)}
                        >
                          Check Out
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <div className="p-4 w-full">
                  {activeTab === "checkIn" && <b>No any check-in today</b>}
                  {activeTab === "currentGuests" && (
                    <b>No any current guest in hotel today</b>
                  )}
                  {activeTab === "checkOut" && <b>No any check-out today</b>}
                </div>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        Array(5)
          .fill(0)
          .map((_, index) => (
            <TableRowSkeleton key={index} activeTab={activeTab} />
          ))
      )}

      {/* Guest Profile Section */}
      <div className="mt-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Guest Profile Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium mb-2">Preferences</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Non-smoking room</li>
              <li>• King bed preferred</li>
              <li>• Early check-in requested</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Special Requirements</h3>
            <p className="text-sm text-gray-600">
              Wheelchair accessible room needed
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Loyalty Status</h3>
            <p className="text-sm text-gray-600">Gold Member (1234 points)</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const TableRowSkeleton = ({ activeTab }) => {
  return (
    <tr className="border-b">
      <td className="p-4">
        <Skeleton width={120} height={20} />
      </td>

      {activeTab === "checkIn" && (
        <td className="p-4">
          <Skeleton width={80} height={20} />
        </td>
      )}

      {activeTab === "currentGuests" && (
        <td className="p-4">
          <Skeleton width={50} height={20} />
        </td>
      )}

      <td className="p-4">
        <Skeleton width={100} height={20} />
      </td>

      <td className="p-4">
        <Skeleton width={80} height={24} borderRadius={12} />
      </td>

      <td className="p-4">
        <div className="flex space-x-2">
          <Skeleton width={60} height={24} />
          {activeTab === "checkIn" && <Skeleton width={70} height={24} />}
          {activeTab === "currentGuests" && <Skeleton width={70} height={24} />}
        </div>
      </td>
    </tr>
  );
};

export default GuestsReci;
