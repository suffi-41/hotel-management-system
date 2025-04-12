import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import Landding from "../Layout/Landding.jsx";
import AdminDashboard from "../Layout/AdminDashborad.jsx";
import LoadingPage from "../components/LoadingPage.jsx";

const AdminProfile = lazy(() => import("../pages/Admin/AdminProfiel.jsx"));
// Skeleton Components
import RoomManagemantSkeleton from "../pages/skeleton/RoomManagemantSkeleton.jsx";
// Lazy-loaded components
const DashboardPage = lazy(() => import("../pages/Admin/DashboardPage.jsx"));
const Login = lazy(() => import("../pages/Login.jsx"));
const Verify = lazy(() => import("../pages/Verify.jsx"));
const Password = lazy(() => import("../pages/Password.jsx"));
const Creatation = lazy(() => import("../pages/Creatation.jsx"));
const Redux = lazy(() => import("../pages/Redux.jsx"));
const ResetPassword = lazy(() => import("../pages/ResetPassword.jsx"));
const LoginCradentical = lazy(() =>
  import("../pages/Admin/authentication/LoginCradential.jsx")
);
const PasswordVerify = lazy(() =>
  import("../pages/Admin/authentication/PasswordVerify.jsx")
);
const CustomerFeedback = lazy(() =>
  import("../pages/Admin/CustomerFeedback.jsx")
);
const RoomManagemant = lazy(() =>
  import("../pages/Admin/room/RoomManagemant.jsx")
);
const Room = lazy(() => import("../pages/Admin/room/Room.jsx"));

const RoomHistory = lazy(() => import("../pages/Admin/room/RoomHistory.jsx"));

// const Bookings = lazy(() => import("../pages/Admin/Bookings.jsx"));

const NotFoundpage = lazy(() => import("../pages/NotFoundpage.jsx"));

// room booking history
const RoomBookingHistory = lazy(() =>
  import("../pages/Admin/RoomBookingHistory.jsx")
);

//user component  in admin dashboard
const UsersManagemant = lazy(() =>
  import("../pages/Admin/users/UsersManagement.jsx")
);

const Userprofile = lazy(() => import("../pages/Admin/users/Userprofile.jsx"));
const BookingDetails = lazy(() =>
  import("../pages/Admin/users/BooKingDetails.jsx")
);
const NotificationAd = lazy(() => import("../pages/Admin/NotificationAd.jsx"));
//Visualized
const Report = lazy(() => import("../pages/Admin/inside/Report.jsx"));

//user
const ShowRoom = lazy(() => import("../pages/User/ShowRoom.jsx"));
const RoomDetialsShow = lazy(() =>
  import("../pages/User/component/RoomDetialShow.jsx")
);

const BookingRoom = lazy(() => import("../pages/User/BookingRoom.jsx"));
const PaymentPage = lazy(() => import("../components/PaymentPage.jsx"));
const PaymentOtp = lazy(() => import("../components/PaymentOtp.jsx"));
const Dashboard = lazy(() => import("../pages/User/dashboard/Dashboard.jsx"));
const UserProfilePage = lazy(() =>
  import("../pages/User/dashboard/UserProflePage.jsx")
);
const BookedRoom = lazy(() => import("../pages/User/dashboard/BookedRoom.jsx"));
const ContactPage = lazy(() => import("../pages/User/Contectpage.jsx"));
const FacilitiesPage = lazy(() => import("../pages/User/FacilitiesPage.jsx"));
const BookingDetailsShow = lazy(() =>
  import("../components/BookingDetialsShow.jsx")
);

const Notification = lazy(() =>
  import("../pages/User/dashboard/Notification.jsx")
);

const RoomDetials = lazy(() => import("../pages/User/RoomDetail.jsx"));

const DashboardScreen = lazy(() => import("../Layout/DashboardScreen.jsx"));
// Reusable Suspense Wrapper
const SuspenseWrapper = ({ Component, fallback = <LoadingPage /> }) => (
  <Suspense fallback={fallback}>
    <Component />
  </Suspense>
);

// Receptionist component
import ReceptionistLayout from "../Layout/ReceptionistLayout.jsx";
const ReceptionistDashboard = lazy(() =>
  import("../pages/Receptionist/ReceptionistDashboard.jsx")
);
const RoomReci = lazy(() => import("../pages/Receptionist/pages/RoomReci.jsx"));
const BookingsReci = lazy(() =>
  import("../pages/Receptionist/pages/BookingsReci.jsx")
);
const ReportsReci = lazy(() =>
  import("../pages/Receptionist/pages/ReportsReci.jsx")
);

const GuestsReci = lazy(() =>
  import("../pages/Receptionist/pages/GuestsReci.jsx")
);

const BookingRoomReci = lazy(() =>
  import("../pages/Receptionist/pages/BookingRoomReci.jsx")
);

const GuestProfile = lazy(() =>
  import("../pages/Receptionist/pages/GuestProfile.jsx")
);

const BillingHistory = lazy(() => import("../pages/Admin/BillinHisotry.jsx"));

const LoginCradentialReci = lazy(() =>
  import("../pages/Receptionist/authentication/LoginCradentialReci.jsx")
);
const PasswordVerifyReci = lazy(() =>
  import("../pages/Receptionist/authentication/PasswordVerifyReci.jsx")
);

const Verified = lazy(() =>
  import("../pages/Receptionist/authentication/Verified.jsx")
);

const ResetPasswordReci = lazy(() =>
  import("../pages/Receptionist/authentication/ResetPassword.jsx")
);

const NotificationReci = lazy(() =>
  import("../pages/Receptionist/pages/NotificationReci.jsx")
);

const ProfileReci = lazy(() =>
  import("../pages/Receptionist/pages/ProfileReci.jsx")
);

// Router Configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <Landding>
            <SuspenseWrapper Component={ShowRoom} />
          </Landding>
        ),
      },
      {
        path: "/room/:id",
        element: (
          <Landding>
            <SuspenseWrapper Component={RoomDetials} />
          </Landding>
        ),
      },
      {
        path: "/booking-room/:id",
        element: (
          <Landding>
            <SuspenseWrapper Component={BookingRoom} />
          </Landding>
        ),
      },
      {
        path: "/room/booking-room/payment/:id",
        element: (
          <Landding>
            <SuspenseWrapper Component={PaymentPage} />
          </Landding>
        ),
      },
      {
        path: "/room/booking-room/payment/otp/:id",
        element: (
          <Landding>
            <SuspenseWrapper Component={PaymentOtp} />
          </Landding>
        ),
      },
      {
        path: "/contact",
        element: (
          <Landding>{<SuspenseWrapper Component={ContactPage} />}</Landding>
        ),
      },
      {
        path: "/facilities",
        element: (
          <Landding>{<SuspenseWrapper Component={FacilitiesPage} />}</Landding>
        ),
      },
      {
        path: "/user-dashboard",
        element: (
          <Landding>
            <SuspenseWrapper Component={Dashboard} />
          </Landding>
        ),
        children: [
          {
            path: "profile",
            element: (
              <DashboardScreen>
                <SuspenseWrapper Component={UserProfilePage} />
              </DashboardScreen>
            ),
          },
          {
            path: "bookings",
            element: (
              <DashboardScreen>
                <SuspenseWrapper Component={BookedRoom} />
              </DashboardScreen>
            ),
          },
          {
            path: "notification",
            element: (
              <DashboardScreen>
                <SuspenseWrapper Component={Notification} />
              </DashboardScreen>
            ),
          },
          {
            path: "bookings/details/:id",
            element: (
              <DashboardScreen>
                <SuspenseWrapper Component={BookingDetailsShow} />
              </DashboardScreen>
            ),
          },
          {
            path: "notification",
            element: <div>Notification</div>,
          },
        ],
      },
      {
        path: "/authentication",
        element: <Landding>{<SuspenseWrapper Component={Login} />}</Landding>,
      },
      {
        path: "/authentication/signup",
        element: (
          <Landding>{<SuspenseWrapper Component={Creatation} />}</Landding>
        ),
      },
      {
        path: "/authentication/verify",
        element: <Landding>{<SuspenseWrapper Component={Verify} />}</Landding>,
      },
      {
        path: "/authentication/password",
        element: (
          <Landding>{<SuspenseWrapper Component={Password} />}</Landding>
        ),
      },
      {
        path: "/authentication/reset-password/accound-verification",
        element: <Landding>{<SuspenseWrapper Component={Verify} />}</Landding>,
      },
      {
        path: "/authentication/reset-password/create-password",
        element: (
          <Landding>{<SuspenseWrapper Component={ResetPassword} />}</Landding>
        ),
      },
      {
        path: "redux",
        element: <Landding>{<SuspenseWrapper Component={Redux} />}</Landding>,
      },
      {
        path: "/admin",
        element: <App />,
        children: [
          {
            path: "/admin",
            element: (
              <AdminDashboard>
                {<SuspenseWrapper Component={DashboardPage} />}
              </AdminDashboard>
            ),
          },
          {
            path: "login",
            element: (
              <AdminDashboard>
                {<SuspenseWrapper Component={LoginCradentical} />}
              </AdminDashboard>
            ),
          },
          {
            path: "password-verify",
            element: (
              <AdminDashboard>
                {<SuspenseWrapper Component={PasswordVerify} />}
              </AdminDashboard>
            ),
          },
          {
            path: "profile",
            element: (
              <AdminDashboard>
                {<SuspenseWrapper Component={AdminProfile} />}
              </AdminDashboard>
            ),
          },
          {
            path: "/admin/dashboard/rooms",
            element: (
              <AdminDashboard>
                <SuspenseWrapper
                  Component={RoomManagemant}
                  fallback={<RoomManagemantSkeleton />}
                />
              </AdminDashboard>
            ),
          },
          {
            path: "/admin/dashboard/rooms/:id",
            element: (
              <AdminDashboard>
                {<SuspenseWrapper Component={Room} />}
              </AdminDashboard>
            ),
          },
          {
            path: "/admin/dashboard/rooms/history/:id",
            element: (
              <AdminDashboard>
                {<SuspenseWrapper Component={RoomHistory} />}
              </AdminDashboard>
            ),
          },
          {
            path: "/admin/dashboard/users/bookings/details/:id",
            element: (
              <AdminDashboard>
                {<SuspenseWrapper Component={BookingDetailsShow} />}
              </AdminDashboard>
            ),
          },
          {
            path: "/admin/dashboard/bookings",
            element: (
              <AdminDashboard>
                {<SuspenseWrapper Component={BillingHistory} />}
              </AdminDashboard>
            ),
          },
          {
            path: "/admin/dashboard/notification",
            element: (
              <AdminDashboard>
                {<SuspenseWrapper Component={NotificationAd} />}
              </AdminDashboard>
            ),
          },
          {
            path: "/admin/dashboard/feedback",
            element: (
              <AdminDashboard>
                {<SuspenseWrapper Component={CustomerFeedback} />}
              </AdminDashboard>
            ),
          },
          {
            path: "/admin/dashboard/users",
            element: (
              <AdminDashboard>
                {<SuspenseWrapper Component={UsersManagemant} />}
              </AdminDashboard>
            ),
          },
          {
            path: "/admin/dashboard/users/user-profile/:id",
            element: (
              <AdminDashboard>
                {<SuspenseWrapper Component={Userprofile} />}
              </AdminDashboard>
            ),
          },
          {
            path: "/admin/dashboard/room-booking-history",
            element: (
              <AdminDashboard>
                {<SuspenseWrapper Component={RoomBookingHistory} />}
              </AdminDashboard>
            ),
          },
          {
            path: "/admin/dashboard/users/booking-history/:id",
            element: (
              <AdminDashboard>
                {<SuspenseWrapper Component={BookingDetails} />}
              </AdminDashboard>
            ),
          },
          {
            path: "/admin/dashboard/report",
            element: (
              <AdminDashboard>
                {<SuspenseWrapper Component={Report} />}
              </AdminDashboard>
            ),
          },
        ],
      },
      {
        path: "/receptionist/dashboard",
        element: <App />,
        children: [
          {
            path: "login",
            element: (
              <ReceptionistLayout>
                {<SuspenseWrapper Component={LoginCradentialReci} />}
              </ReceptionistLayout>
            ),
          },
          {
            path: "password-verify",
            element: (
              <ReceptionistLayout>
                {<SuspenseWrapper Component={PasswordVerifyReci} />}
              </ReceptionistLayout>
            ),
          },
          {
            path: "verify-account",
            element: (
              <ReceptionistLayout>
                {<SuspenseWrapper Component={Verified} />}
              </ReceptionistLayout>
            ),
          },
          {
            path: "reset-password",
            element: (
              <ReceptionistLayout>
                {<SuspenseWrapper Component={ResetPasswordReci} />}
              </ReceptionistLayout>
            ),
          },
          {
            path: "/receptionist/dashboard",
            element: (
              <ReceptionistLayout>
                {<SuspenseWrapper Component={ReceptionistDashboard} />}
              </ReceptionistLayout>
            ),
          },
          {
            path: "rooms",
            element: (
              <ReceptionistLayout>
                {<SuspenseWrapper Component={RoomReci} />}
              </ReceptionistLayout>
            ),
          },
          {
            path: "guests",
            element: (
              <ReceptionistLayout>
                {<SuspenseWrapper Component={GuestsReci} />}
              </ReceptionistLayout>
            ),
          },
          {
            path: "bookings",
            element: (
              <ReceptionistLayout>
                {<SuspenseWrapper Component={BookingsReci} />}
              </ReceptionistLayout>
            ),
          },
          {
            path: "bookings/booking-room/:id",
            element: (
              <ReceptionistLayout>
                {<SuspenseWrapper Component={BookingRoomReci} />}
              </ReceptionistLayout>
            ),
          },
          {
            path: "reports",
            element: (
              <ReceptionistLayout>
                {<SuspenseWrapper Component={ReportsReci} />}
              </ReceptionistLayout>
            ),
          },
          {
            path: "guest-profile/:id",
            element: (
              <ReceptionistLayout>
                {<SuspenseWrapper Component={GuestProfile} />}
              </ReceptionistLayout>
            ),
          },

          {
            path: "booking-detials/:id",
            element: (
              <ReceptionistLayout>
                {<SuspenseWrapper Component={BookingDetailsShow} />}
              </ReceptionistLayout>
            ),
          },
          {
            path: "notification",
            element: (
              <ReceptionistLayout>
                {<SuspenseWrapper Component={NotificationReci} />}
              </ReceptionistLayout>
            ),
          },
          {
            path: "profile",
            element: (
              <ReceptionistLayout>
                {<SuspenseWrapper Component={ProfileReci} />}
              </ReceptionistLayout>
            ),
          },
        ],
      },
      {
        path: "*",
        element: <SuspenseWrapper Component={NotFoundpage} />,
      },
    ],
  },
]);

export default router;
