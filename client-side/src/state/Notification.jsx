import React, {
  createContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { io } from "socket.io-client";
const socket = io("http://localhost:4140");
import {
  getGuestNotificationUrl,
  markAllReadUrl,
  getReciptionistNotificationUrl,
  getManagerNotificationUrl,
} from "../utils/api";
import { logged_token, admin_token, staff_token } from "../utils/extra";
import notification_1 from "../assets/notification/notification-3.mp3";

//redux
import { actionCreator } from "../redux";
import { bindActionCreators } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export const NotificationContext = createContext();

export function Notification({ children }) {
  const dispatch = useDispatch();
  const { SetNotification, AddNotification } = bindActionCreators(
    actionCreator,
    dispatch
  );
  const { userId, reciptionistId, managerId } = useSelector(
    (state) => state.userAvatureReducer
  );

  const [employees, setEmployees] = useState(false);
  useEffect(() => {
    if (reciptionistId) {
      setEmployees(true);
    }
    if (managerId) {
      setEmployees(true);
    }
  }, [reciptionistId, managerId]);

  const auth_token = logged_token();
  const auth_admin_token = admin_token();
  const auth_staff_token = staff_token();

  const guestHeader = {
    "Content-Type": "application/json",
    "authorized-user-token": auth_token,
  };

  const adminHeader = {
    "Content-Type": "application/json",
    "authorized-user-token": auth_admin_token,
  };

  const reciptionistHeader = {
    "Content-Type": "application/json",
    "authorized-user-token": auth_staff_token,
  };

  const alertToNotification = (message) => {
    if (
      window.location.pathname !== "/admin/dashboard/notification" ||
      window.location.pathname !== "/receptionist/dashboard/notification" ||
      window.location.pathname !== "/user-dashboard/notification"
    ) {
      toast.warn(message);
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket is Connected");
    });

    if (userId) {
      socket.emit("join-room", {
        userId,
        role: "guest",
      });
    }
    if (reciptionistId) {
      socket.emit("join-room", {
        userId: reciptionistId,
        role: "receptionist",
      });
    }
    if (managerId) {
      socket.emit("join-room", {
        userId: managerId,
        role: "manager",
      });
    }

    socket.on("new-booking", (data) => {
      AddNotification(data);
      !employees && alertToNotification("New booking");
    });

    socket.on("cancelled-booking", (data) => {
      AddNotification(data);
      !employees && alertToNotification("Booking cancelled");
    });

    socket.on("check-in-alert", (data) => {
      AddNotification(data);
      alertToNotification("Check-in alert");
    });
    socket.on("check-out-alert", (data) => {
      AddNotification(data);
      alertToNotification("Check-out alert");
    });

    socket.on("checked-in", (data) => {
      AddNotification(data);
      console.log("checked-in")
      alertToNotification("Checked-in");
    });

    socket.on("checked-out", (data) => {
      AddNotification(data);
      alertToNotification("Checked-out");
    });

    return () => {
      socket.off();
    };
  }, [socket, userId, reciptionistId, managerId]);

  const newBookingNotification = (data) => {
    !employees && AddNotification(data);
    socket.emit("new-booking", data);
  };
  const bookingCancelledNotification = (data) => {
    !employees && AddNotification(data);
    socket.emit("cancelled-booking", data);
  };

  const getGuestNotification = async () => {
    try {
      const res = await fetch(getGuestNotificationUrl, {
        method: "GET",
        headers: guestHeader,
      });
      const resData = await res.json();
      if (resData?.status) {
        SetNotification(resData.notifications);
      } else {
        toast.error(resData.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getGuestNotificationReciptionist = async () => {
    try {
      const res = await fetch(getReciptionistNotificationUrl, {
        method: "GET",
        headers: reciptionistHeader,
      });
      const resData = await res.json();
      if (resData?.status) {
        SetNotification(resData.notifications);
      } else {
        toast.error(resData.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getGuestNotificationManager = async () => {
    try {
      const res = await fetch(getManagerNotificationUrl, {
        method: "GET",
        headers: adminHeader,
      });
      const resData = await res.json();
      if (resData?.status) {
        SetNotification(resData.notifications);
      } else {
        toast.error(resData.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    userId && getGuestNotification();
    reciptionistId && getGuestNotificationReciptionist();
    managerId && getGuestNotificationManager();
  }, [userId, reciptionistId, managerId]);

  const markAllRead = async () => {
    try {
      const res = await fetch(markAllReadUrl, {
        method: "put",
        headers: guestHeader,
      });
      const data = await res.json();
      console.log(data);
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  const markAllRead_ad_Reci = async (userType) => {
    try {
      const res = await fetch(`${markAllReadUrl}/${userType}`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        newBookingNotification,
        markAllRead,
        markAllRead_ad_Reci,
        bookingCancelledNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
