import React, { useState, useEffect, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { NotificationContext } from "../../../state/Notification";
import { actionCreator } from "../../../redux";
import { bindActionCreators } from "redux";
import { useDispatch, useSelector } from "react-redux";

const NotificationReci = ({ userId }) => {
  const { markAllRead_ad_Reci } = useContext(NotificationContext);
  const dispatch = useDispatch();
  const { updateNotificationStatus } = bindActionCreators(
    actionCreator,
    dispatch
  );
  const { notifications } = useSelector((state) => state?.notificationReducer);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const { data } = useQuery({
    queryKey: ["mark-all-read", "Reciptionist"],
    queryFn: () => markAllRead_ad_Reci("Reciptionist"),
  });

  useEffect(() => {
    if (data?.status) {
      updateNotificationStatus();
    }
  }, [data]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "booking":
        return "🏨";
      case "checkin":
        return "🔑";
      case "checkout":
        return "🧳";
      case "payment":
        return "💳";
      default:
        return "🔔";
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6 bg-white shadow-sm px-10 py-4">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <div className="flex gap-4">
          <select className="p-2 border rounded">
            <option value="all">All Notifications</option>
            <option value="booking">Bookings</option>
            <option value="checkin">Check-ins</option>
            <option value="checkout">Check-outs</option>
            <option value="payment">Payments</option>
          </select>
          <button
            // onClick={markAllAsRead}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Mark All as Read
          </button>
        </div>
      </div>

      <div className="space-y-1">
        {notifications?.map((notification) => (
          <motion.div
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            key={notification._id}
            className={`p-4 rounded-sm shadow-sm ${
              notification.status === "unread"
                ? "bg-blue-50 border-blue-200"
                : "bg-white"
            }`}
          >
            <div className="flex items-start gap-4">
              <span className="text-2xl">
                {getNotificationIcon(notification.type)}
              </span>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">
                    {notification.message.title}
                  </h3>
                  {notification.status === "unread" && (
                    <button
                      onClick={() => markAsRead(notification._id)}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
                <p className="text-gray-600 mt-1 text-start">
                  {notification.message.content}
                </p>
                <div className="mt-2 text-sm text-gray-500 text-start">
                  <span>
                    {new Date(notification.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>
                  {notification.metadata.roomNumber && (
                    <span className="ml-4">
                      Room: {notification.metadata.roomNumber}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        {notifications?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No notifications found
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationReci;
