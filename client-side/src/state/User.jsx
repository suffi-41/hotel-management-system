import { createContext } from "react";
import { Room } from "./Room";
import { Visualized } from "./Visualized";
import { ReviewsProvider } from "./Review";
import { Notification } from "./Notification";
import { useSelector } from "react-redux";

import {
  getUserAvatureUrl,
  sendOtpUrl,
  addEmployeeUrl,
  getAllEmployessUrl,
  updateEmployeeDetialsUrl,
  inActivatedEmployeeUrl,
  inActivatedEmployeesUrl,
  getEmployeeDetialsUrl,
  getEmployeedetailsWithTokenUrl,
  editNameUrl,
  editAddressUrl,
  editDateOfBirthUrl,
  editPhoneUrl,
  changePasswordUrl,
  getUserProfileUrl,
  editGenderUrl,
  uploadProfilePicUrl,
  getAllusersUrl,
  getUserByIdUrl,
  blockedAndUnblockedUserUrl,
  updateEmployeeDetialsWithTokenUrl,
  employeeUploadProfilePicUrl,
  employeeOtpSenderUrl,
  employeeVerificationUrl,
  employeeResetPasswordUrl,
  getEmpAvatueAndIdUrl,
} from "../utils/api";

import { logged_token, admin_token, staff_token } from "../utils/extra";

export const UserContext = createContext();

export function User({ children }) {
  const { reciptionistId, managerId } = useSelector(
    (state) => state.userAvatureReducer
  );

  const auth_token = logged_token();
  const auth_admin_token = admin_token();
  const auth_staff_token = staff_token();
  let username = "User";
  const sendOtp = async (id) => {
    try {
      const response = await fetch(`${sendOtpUrl}/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  // employees users
  const addStaffDetails = async (details) => {
    try {
      const response = await fetch(addEmployeeUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      });
      return response.json();
    } catch (error) {
      console.log(error);
    }
  };

  // get all employees with query

  const getAllEmployees = async (query) => {
    try {
      const response = await fetch(`${getAllEmployessUrl}?${query}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  // uodate employee detials
  const updateEmployeeDetials = async (id, details) => {
    try {
      const response = await fetch(`${updateEmployeeDetialsUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      });
      const responseData = await response.json();
      return await responseData;
    } catch (error) {
      console.log(error);
    }
  };

  //Inactivated employee function
  const inActivatedEmployeeFunction = async (id) => {
    try {
      const response = await fetch(`${inActivatedEmployeeUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.log(error);
    }
  };

  //Get inactivated employess
  const getInActivatedEmployees = async () => {
    try {
      const response = await fetch(`${inActivatedEmployeesUrl}`);
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.log(error);
    }
  };

  // get one employee details
  const getOneEmployeeDetails = async (id) => {
    try {
      const response = await fetch(`${getEmployeeDetialsUrl}/${id}`);
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.log(error);
    }
  };

  //admin access user detials from server
  const getAllUsers = async (req, res) => {
    try {
      const res = await fetch(getAllusersUrl);
      const resData = await res.json();
      return resData;
    } catch (error) {
      console.log(error);
    }
  };

  //get user by id
  const getUserById = async (id) => {
    try {
      const res = await fetch(`${getUserByIdUrl}/${id}`);
      return await res.json();
    } catch (error) {
      console.log(error);
    }
  };

  // edit function for user profile
  const headers = {
    "Content-Type": "application/json",
    "authorized-user-token": auth_token,
  };

  const editNameFunction = async (name) => {
    try {
      const response = await fetch(editNameUrl, {
        method: "put",
        headers: headers,
        body: JSON.stringify({ name }),
      });
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  const editPhone = async (phone) => {
    try {
      const response = await fetch(editPhoneUrl, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify({ phone }),
      });
      return response.json();
    } catch (error) {
      console.log(error);
    }
  };

  const EditdataOfBirth = async (dataOfBirth) => {
    try {
      const response = await fetch(editDateOfBirthUrl, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify({ dataOfBirth }),
      });
      return response.json();
    } catch (error) {
      console.log(error);
    }
  };

  const Editaddress = async (address) => {
    try {
      const response = await fetch(editAddressUrl, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify({ address }),
      });
      return response.json();
    } catch (error) {
      console.log(error);
    }
  };
  const editGender = async (gender) => {
    try {
      const response = await fetch(editGenderUrl, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify({ gender }),
      });
      return response.json();
    } catch (error) {
      console.log(error);
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await fetch(changePasswordUrl, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      return response.json();
    } catch (error) {
      console.log(error);
    }
  };

  const getUserprofile = async () => {
    try {
      const response = await fetch(getUserProfileUrl, {
        method: "GET",
        headers: headers,
      });
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  const uploadProfilepic = async (formData) => {
    try {
      const response = await fetch(uploadProfilePicUrl, {
        method: "PUT",
        headers: {
          "authorized-user-token": auth_token,
        },
        body: formData,
      });
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  };
  const getUserAvature = async () => {
    try {
      const response = await fetch(getUserAvatureUrl, {
        headers: headers,
      });
      const responseData = await response.json();
      return await responseData;
    } catch (error) {
      console.log(error);
    }
  };

  const blockedAndUnblockuser = async (id) => {
    try {
      const response = await fetch(`${blockedAndUnblockedUserUrl}/${id}`, {
        method: "PUT",
        headers: headers,
      });
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  const employeeHeaders = {
    "Content-Type": "application/json",
    "authorized-user-token": reciptionistId
      ? auth_staff_token
      : auth_admin_token,
  };
  const getEmployeedetialsWithToken = async () => {
    try {
      const res = await fetch(getEmployeedetailsWithTokenUrl, {
        method: "get",
        headers: employeeHeaders,
      });
      return await res.json();
    } catch (error) {
      console.log(error);
    }
  };
  const updateEmployeeDetialsWithToken = async (details) => {
    try {
      const response = await fetch(updateEmployeeDetialsWithTokenUrl, {
        method: "PUT",
        headers: employeeHeaders,
        body: JSON.stringify(details),
      });
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  const empUploadPic = async (formData) => {
    try {
      const response = await fetch(employeeUploadProfilePicUrl, {
        method: "PUT",
        headers: { "authorized-user-token": employeeHeaders },
        body: formData,
      });
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  const employeeOtpSender = async (id) => {
    try {
      const response = await fetch(`${employeeOtpSenderUrl}/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  const employeeVerification = async ({ id, code }) => {
    try {
      const response = await fetch(`${employeeVerificationUrl}/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp: code }),
      });
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  const employeeResetPassword = async ({ id, password }) => {
    try {
      const response = await fetch(`${employeeResetPasswordUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  const reciptionistHeader = {
    "Content-Type": "application/json",
    "authorized-user-token": auth_staff_token,
  };

  const geAdminAvatueAndId = async () => {
    try {
      const response = await fetch(getEmpAvatueAndIdUrl, {
        method: "GET",
        headers: employeeHeaders,
      });
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  const getEmpAvatueAndId = async () => {
    try {
      const response = await fetch(getEmpAvatueAndIdUrl, {
        method: "GET",
        headers: reciptionistHeader,
      });
      return await response.json();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        username,
        sendOtp,
        addStaffDetails,
        getAllEmployees,
        updateEmployeeDetials,
        inActivatedEmployeeFunction,
        getInActivatedEmployees,
        getOneEmployeeDetails,
        editNameFunction,
        editPhone,
        EditdataOfBirth,
        Editaddress,
        changePassword,
        getUserprofile,
        editGender,
        uploadProfilepic,
        getUserAvature,
        getAllUsers,
        getUserById,
        blockedAndUnblockuser,
        getEmployeedetialsWithToken,
        updateEmployeeDetialsWithToken,
        empUploadPic,
        employeeOtpSender,
        employeeVerification,
        employeeResetPassword,
        getEmpAvatueAndId,
        geAdminAvatueAndId,
      }}
    >
      <Room>
        <Notification>
          <ReviewsProvider>
            <Visualized>{children}</Visualized>
          </ReviewsProvider>
        </Notification>
      </Room>
    </UserContext.Provider>
  );
}
