import express from "express";
import cors from "cors";
import 'dotenv/config'
import CONNECT_DB from "./config/_db.mjs";
const app = express();
CONNECT_DB();
import "./controllers/realtimeupdateNotification.mjs"

//user routes files import
import user from "./routers/user.mjs";

//Employee routes files import
import employess from "./routers/employee.mjs";

// Room routes files import
import room from "./routers/room.mjs";

//Booking routes files import
import booking from "./routers/booking.mjs";

//Booking payment routes files import
import bookingPayment from "./routers/bookingPayment.mjs";



//visualized routes files import
import visualized from "./routers/visualized.mjs"

// Contact routes file import
import contact from "./routers/contact.mjs"

// notificatin router import
import notification from "./routers/notification.mjs"


const port = process.env.PORT || 3333;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


//routes
app.use("/api/v1/user", user);
app.use("/api/v1/employee", employess);
app.use("/api/v1/room", room)
app.use("/api/v1/booking", booking);
app.use("/api/vi/booking-payment", bookingPayment)
app.use("/api/v1/visualized", visualized)
app.use("/api/v1/contact", contact)
app.use("/api/v1/notification", notification)

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})
