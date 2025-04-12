import React, { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCamera, FaEdit, FaKey } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import { UserContext } from "../../../state/User";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "../../../utils/extra";

//redux
import { actionCreator } from "../../../redux";
import { bindActionCreators } from "redux";
import { useDispatch, useSelector } from "react-redux";

import ErrorPage from "../../../components/ErrorPage";
import LoadingPage from "../../../components/LoadingPage";

const UserProfilePage = () => {
  const dispatch = useDispatch();
  const action = bindActionCreators(actionCreator, dispatch);
  //user context function
  const {
    getUserprofile,
    editNameFunction,
    editPhone,
    EditdataOfBirth,
    Editaddress,
    changePassword,
    editGender,
    uploadProfilepic,
  } = useContext(UserContext);
  //state
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingDateOfBirth, setIsEditingDateOfBirth] = useState(false);
  const [isEditingGender, setIsEditingGender] = useState(false);

  const { data, isLoading, isError, error, errorMessage } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserprofile,
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (data?.status) {
      setUser(data.UserData);
    } else {
      toast;
    }
    return () => {
      setUser(null);
    };
  }, [data]);

  // Formik for Name
  const nameFormik = useFormik({
    enableReinitialize: true, // Allow reinitialization
    initialValues: { name: user?.name },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
    }),
    onSubmit: async (values) => {
      const response = await editNameFunction(values?.name);
      const { status, message } = response;
      if (status) {
        toast.success(message);
        setUser((prev) => ({ ...prev, name: values?.name }));
        setIsEditingName(false);
      } else {
        toast.error(message);
      }
    },
  });
  // Formik for Phone
  const phoneFormik = useFormik({
    enableReinitialize: true, // Allow reinitialization
    initialValues: { phoneNumber: user?.phoneNumber },
    validationSchema: Yup.object({
      phoneNumber: Yup.string()
        .matches(/^\d{10}$/, "Phone number must be 10 digits")
        .required("Phone number is required"),
    }),
    onSubmit: async (values) => {
      const response = await editPhone(values?.phoneNumber);
      const { status, message } = response;
      if (status) {
        toast.success(message);
        setUser((prev) => ({ ...prev, phoneNumber: values?.phoneNumber }));
        setIsEditingPhone(false);
      } else {
        toast.error(message);
      }
    },
  });

  // Formik for Password
  const passwordFormik = useFormik({
    enableReinitialize: true, // Allow reinitialization
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("Current password is required"),
      newPassword: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("New password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      const response = await changePassword(
        values.currentPassword,
        values.newPassword
      );
      const { status, message } = await response;
      if (status) {
        toast.success(message);
        setIsEditingPassword(false);
        resetForm();
      } else {
        toast.error(message);
      }
      setIsEditingPassword(false);
    },
  });

  // Handle profile image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    const response = await uploadProfilepic(formData);
    const { status, message, avature } = await response;
    if (file && status) {
      action.setUserAvatuer(avature);
      setUser((prev) => ({ ...prev, avature: avature }));
    } else {
      toast.error(message);
    }
  };
  //import { useFormik } from "formik";

  const genderFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      gender: user?.gender, // Default empty, can be "Male" or "Female"
    },
    validationSchema: Yup.object({
      gender: Yup.string()
        .oneOf(["male", "female", "other"], "Please select a valid gender")
        .required("Gender is required"),
    }),
    onSubmit: async (values) => {
      const response = await editGender(values.gender);
      const { status, message } = response;
      if (status) {
        toast.success(message);
        setUser((prev) => ({ ...prev, gender: values.gender }));
        setIsEditingGender(false);
      } else {
        toast.error(message);
      }
    },
  });

  // Formik for Date of Birth
  const dateOfBirthFormik = useFormik({
    enableReinitialize: true, // Allow reinitialization
    initialValues: { dateOfBirth: user?.dateOfBirth },
    validationSchema: Yup.object({
      dateOfBirth: Yup.date()
        .required("Date of birth is required")
        .max(new Date(), "Date of birth cannot be in the future"),
    }),
    onSubmit: async (values) => {
      const response = await EditdataOfBirth(values.dateOfBirth);
      const { status, message } = response;
      if (status) {
        toast.success(message);
        setUser((prev) => ({ ...prev, dateOfBirth: values.dateOfBirth }));
        setIsEditingDateOfBirth(false);
      } else {
        toast.error(message);
      }
    },
  });

  // address
  const addressFormik = useFormik({
    enableReinitialize: true, // Allow reinitialization
    initialValues: user?.address || "",
    validationSchema: Yup.object({
      street: Yup.string().required("Street is required"),
      city: Yup.string().required("City is required"),
      state: Yup.string().required("State is required"),
      zipCode: Yup.string().matches(/^\d{6}$/, "Invalid Zip Code"),
      country: Yup.string().required("Country is required"),
    }),
    onSubmit: async (values) => {
      const response = await Editaddress(values);
      const { status, message } = response;
      if (status) {
        toast.success(message);
        setUser((prev) => ({ ...prev, address: values }));
        setIsEditingAddress(false);
      } else {
        toast.error(message);
      }
    },
  });

  function formatDate(isoDate) {
    let date = new Date(isoDate);
    let day = String(date.getDate()).padStart(2, "0");
    let month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    let year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  return isLoading ? (
    <LoadingPage />
  ) : isError ? (
    <ErrorPage />
  ) : (
    !isLoading && (
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full mx-auto p-6 bg-white"
      >
        {/* Profile Image and Name Section */}
        {!isEditingName ? (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-r from-blue-400 to-blue-200 p-6 rounded-lg flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border border-white">
                <img
                  src={user?.avature || ""}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <label className="absolute bottom-0 right-0 bg-white text-gray-800 p-1 rounded-full cursor-pointer">
                  <FaCamera />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Name</h3>
                <p className="text-white">{user?.name}</p>
              </div>
            </div>
            <FaEdit
              className="text-gray-700 font-semibold cursor-pointer"
              onClick={() => setIsEditingName(!isEditingName)}
            />
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={nameFormik.handleSubmit}
            className="w-full md:mt-4 shadow-lg rounded-md bg-white"
          >
            <div className="md:w-1/2 p-6 flex flex-col justify-start items-start">
              <label className="text-start p-2">Name</label>
              <input
                type="text"
                name="name"
                value={nameFormik.values?.name}
                onChange={nameFormik.handleChange}
                onBlur={nameFormik.handleBlur}
                className="w-full p-2 border border-gray-300 outline-none"
              />
              {nameFormik.touched.name && nameFormik.errors.name ? (
                <div className="text-red-500 text-sm mt-1">
                  {nameFormik.errors.name}
                </div>
              ) : null}
            </div>
            <div className="flex gap-5 ml-4 p-4 pt-0">
              <button
                type="button"
                className="text-blue-500 font-semibold"
                onClick={() => setIsEditingName(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-blue-500 font-semibold bg-blue-500 text-white py-2 px-4"
              >
                Save
              </button>
            </div>
          </motion.form>
        )}

        {/* Email Section */}
        <div className="text-start mt-4 bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="text-gray-700 font-semibold">Email</h3>
            <p className="text-gray-600">
              {user?.email}
              <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                VERIFIED
              </span>
            </p>
          </div>
        </div>

        {/* Phone Section */}
        {!isEditingPhone ? (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 border-b flex justify-between"
          >
            <div>
              <h3 className="text-gray-700 font-semibold">Phone number</h3>
              <p className="text-gray-600">
                {user?.phoneNumber || "Not provided"}
              </p>
            </div>
            <FaEdit
              className="text-gray-700 font-semibold cursor-pointer"
              onClick={() => setIsEditingPhone(!isEditingPhone)}
            />
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={phoneFormik.handleSubmit}
            className="w-full md:mt-4 shadow-lg rounded-md bg-white"
          >
            <div className="md:w-1/2 p-6 flex flex-col justify-start items-start">
              <label className="text-start p-2">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={phoneFormik.values.phoneNumber}
                onChange={phoneFormik.handleChange}
                onBlur={phoneFormik.handleBlur}
                className="w-full p-2 border border-gray-300 outline-none"
              />
              {phoneFormik.touched.phoneNumber &&
              phoneFormik.errors.phoneNumber ? (
                <div className="text-red-500 text-sm mt-1">
                  {phoneFormik.errors.phoneNumber}
                </div>
              ) : null}
            </div>
            <div className="flex gap-5 ml-4 p-4 pt-0">
              <button
                type="button"
                className="text-blue-500 font-semibold"
                onClick={() => setIsEditingPhone(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-blue-500 font-semibold bg-blue-500 text-white py-2 px-4"
              >
                Save
              </button>
            </div>
          </motion.form>
        )}

        {/* Password Section */}
        {!isEditingPassword ? (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 flex justify-between"
          >
            <div>
              <h3 className="text-gray-700 font-semibold">Password</h3>
              <p className="text-gray-600">{user?.password || "***********"}</p>
            </div>
            <FaKey
              className="text-blue-500 font-semibold cursor-pointer"
              onClick={() => setIsEditingPassword(!isEditingPassword)}
            />
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={passwordFormik.handleSubmit}
            className="w-full md:mt-4 shadow-lg rounded-md bg-white"
          >
            <h2 className="p-4 text-gray-700 font-semibold">Change Password</h2>
            <div className="md:w-1/2 p-2 flex flex-col justify-start items-start">
              <label className="text-start p-2">Current password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordFormik.values.currentPassword}
                onChange={passwordFormik.handleChange}
                onBlur={passwordFormik.handleBlur}
                className="w-full p-2 border border-gray-300 outline-none"
              />
              {passwordFormik.touched.currentPassword &&
              passwordFormik.errors.currentPassword ? (
                <div className="text-red-500 text-sm mt-1">
                  {passwordFormik.errors.currentPassword}
                </div>
              ) : null}
            </div>
            <div className="md:w-1/2 p-2 flex flex-col justify-start items-start">
              <label className="text-start p-2">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordFormik.values.newPassword}
                onChange={passwordFormik.handleChange}
                onBlur={passwordFormik.handleBlur}
                className="w-full p-2 border border-gray-300 outline-none"
              />
              {passwordFormik.touched.newPassword &&
              passwordFormik.errors.newPassword ? (
                <div className="text-red-500 text-sm mt-1">
                  {passwordFormik.errors.newPassword}
                </div>
              ) : null}
            </div>
            <div className="md:w-1/2 p-2 flex flex-col justify-start items-start">
              <label className="text-start p-2">Confirm password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordFormik.values.confirmPassword}
                onChange={passwordFormik.handleChange}
                onBlur={passwordFormik.handleBlur}
                className="w-full p-2 border border-gray-300 outline-none"
              />
              {passwordFormik.touched.confirmPassword &&
              passwordFormik.errors.confirmPassword ? (
                <div className="text-red-500 text-sm mt-1">
                  {passwordFormik.errors.confirmPassword}
                </div>
              ) : null}
            </div>
            <div className="flex gap-5 ml-4 p-4 pt-0">
              <button
                type="button"
                className="text-blue-500 font-semibold"
                onClick={() => setIsEditingPassword(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-blue-500 font-semibold bg-blue-500 text-white py-2 px-4"
              >
                Change
              </button>
            </div>
          </motion.form>
        )}
        {!isEditingGender ? (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 border-b flex justify-between"
          >
            <div>
              <h3 className="text-gray-700 font-semibold">Gender</h3>
              <p className="text-gray-600">{user?.gender || "Not specified"}</p>
            </div>
            <FaEdit
              className="text-gray-700 font-semibold cursor-pointer"
              onClick={() => setIsEditingGender(true)}
            />
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={genderFormik.handleSubmit}
            className="w-full md:mt-4 shadow-lg rounded-md bg-white"
          >
            <div className="md:w-1/2 p-6 flex flex-col justify-start items-start">
              <label className="text-start p-2">Select Gender</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={genderFormik.values.gender === "male"}
                    onChange={genderFormik.handleChange}
                    className="w-4 h-4"
                  />
                  Male
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={genderFormik.values.gender === "female"}
                    onChange={genderFormik.handleChange}
                    className="w-4 h-4"
                  />
                  Female
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    checked={genderFormik.values.gender === "other"}
                    onChange={genderFormik.handleChange}
                    className="w-4 h-4"
                  />
                  Other
                </label>
              </div>
              {genderFormik.touched.gender && genderFormik.errors.gender ? (
                <div className="text-red-500 text-sm mt-1">
                  {genderFormik.errors.gender}
                </div>
              ) : null}
            </div>
            <div className="flex gap-5 ml-4 p-4 pt-0">
              <button
                type="button"
                className="text-blue-500 font-semibold"
                onClick={() => setIsEditingGender(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-blue-500 font-semibold bg-blue-500 text-white py-2 px-4"
              >
                Save
              </button>
            </div>
          </motion.form>
        )}

        {/* Date of Birth */}
        {!isEditingDateOfBirth ? (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 border-b flex justify-between"
          >
            <div>
              <h3 className="text-gray-700 font-semibold">Date of Birth</h3>
              <p className="text-gray-600">
                {user?.dateOfBirth
                  ? formatDate(user?.dateOfBirth)
                  : "Not provided"}
              </p>
            </div>
            <FaEdit
              className="text-gray-700 font-semibold cursor-pointer"
              onClick={() => setIsEditingDateOfBirth(!isEditingDateOfBirth)}
            />
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={dateOfBirthFormik.handleSubmit}
            className="w-full md:mt-4 shadow-lg rounded-md bg-white"
          >
            <div className="md:w-1/2 p-6 flex flex-col justify-start items-start">
              <label className="text-start p-2">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={dateOfBirthFormik.values.dateOfBirth}
                onChange={dateOfBirthFormik.handleChange}
                onBlur={dateOfBirthFormik.handleBlur}
                className="w-full p-2 border border-gray-300 outline-none"
              />
              {dateOfBirthFormik.touched.dateOfBirth &&
              dateOfBirthFormik.errors.dateOfBirth ? (
                <div className="text-red-500 text-sm mt-1">
                  {dateOfBirthFormik.errors.dateOfBirth}
                </div>
              ) : null}
            </div>
            <div className="flex gap-5 ml-4 p-4 pt-0">
              <button
                type="button"
                className="text-blue-500 font-semibold"
                onClick={() => setIsEditingDateOfBirth(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-blue-500 font-semibold bg-blue-500 text-white py-2 px-4"
              >
                Save
              </button>
            </div>
          </motion.form>
        )}

        {/* Address */}
        {!isEditingAddress ? (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 border-b flex justify-between"
          >
            <div>
              <h3 className="text-gray-700 font-semibold">Address</h3>
              <p className="text-gray-600">
                {user?.address?.street
                  ? `${user?.address.street}, ${user?.address.city}, ${user?.address.state}, ${user?.address.zipCode}, ${user?.address.country}`
                  : "Not provided"}
              </p>
            </div>
            <FaEdit
              className="text-gray-700 font-semibold cursor-pointer"
              onClick={() => setIsEditingAddress(true)}
            />
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={addressFormik.handleSubmit}
            className="w-full shadow-lg rounded-md bg-white p-6"
          >
            <h3 className="text-lg font-semibold">Edit Address</h3>
            {["street", "city", "state", "zipCode", "country"].map((field) => (
              <div
                key={field}
                className="md:w-1/2 p-2 flex flex-col justify-start items-start"
              >
                <label className="text-start p-2">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="text"
                  name={field}
                  value={addressFormik.values[field]}
                  onChange={addressFormik.handleChange}
                  className="w-full p-2 border border-gray-300 outline-none"
                />
                {addressFormik.touched[field] &&
                  addressFormik.errors[field] && (
                    <div className="text-red-500 text-sm">
                      {addressFormik.errors[field]}
                    </div>
                  )}
              </div>
            ))}
            <div className="flex gap-5 mt-4">
              <button
                type="button"
                className="text-blue-500 font-semibold"
                onClick={() => setIsEditingAddress(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-blue-500 font-semibold bg-blue-500 text-white py-2 px-4 rounded-md"
              >
                Save
              </button>
            </div>
          </motion.form>
        )}
      </motion.div>
    )
  );
};
export default UserProfilePage;
