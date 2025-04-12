import { Router } from "express";
import multer from "multer"
const router = Router();
import { fetchUser } from "../middleware/fetchUser.mjs"

const storage = multer.diskStorage({});
const uploader = multer({ storage: storage });

// Controller for handling the data and files
import {
  addRoomDetials,
  getRoomDetials,
  updateRoomDetials,
  addRoomImages,
  getOneRoomDetials,
  deleteRoom,
  addReviews,
  roomTypeGroupforSum,
  updateAmenity,


} from "../controllers/room.mjs";


router.route("/add-room-detials").post(uploader.array("images", 10), addRoomDetials);
router.route("/?").get(getRoomDetials)
router.route("/get-one-room-details/:id").get(getOneRoomDetials);
router.route("/:id").put(updateRoomDetials).delete(deleteRoom);
router.route("/add-room-images").post(uploader.array("images", 10), addRoomImages);
router.route("/add-reviews/:id").post(fetchUser, addReviews)
router.route("/get-room-type-group-of-sum").get(roomTypeGroupforSum);
router.route("/update-amenity/:id").put(updateAmenity);


export default router;
