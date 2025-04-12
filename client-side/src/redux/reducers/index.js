import { combineReducers } from "redux";
import changeNumber from "./UpDown";
import isLoggedReducer from "./Auth";
import roomReducer from "./Room";
import employeeReducer from "./Employee"
import userAvatureReducer from "./User"
import UserReducer from "./UserRedux"
import notificationReducer from "./Notification"

// import counterReducer from "./counterReducer";
// import isLoggedReducer from "./isLoggedReducer";

const rootReducer = combineReducers({
  changeNumber,
  isLoggedReducer,
  roomReducer,
  employeeReducer,
  userAvatureReducer,
  UserReducer,
  notificationReducer
});

export default rootReducer;