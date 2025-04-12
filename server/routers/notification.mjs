import { Router } from "express"
const router = Router()
import { fetchUser } from "../middleware/fetchUser.mjs";
import { getGuestNotifications, updateStatus, getReciptionistNotifications, getManagerNotifications, updateStatus_Ad_Reci } from "../controllers/Notification.mjs";

router.route("/get-guest-notifications").get(fetchUser, getGuestNotifications)
router.route("/mark-all-read").put(fetchUser, updateStatus)
router.route("/get-receptionist-notifications").get(getReciptionistNotifications)
router.route("/get-manager-notifications").get(getManagerNotifications)
router.route("/mark-all-read/:userType").put(updateStatus_Ad_Reci)

export default router;