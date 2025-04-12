import { motion } from "framer-motion";
import { useState, useRef, useEffect, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useQuery } from "@tanstack/react-query";
import { UserContext } from "../../../state/User";
import LoadingPage from "../../../components/LoadingPage";
import { toast } from "react-toastify";
import {
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBriefcase,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaPhone,
} from "react-icons/fa";

// Validation Schema
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  phoneNumber: Yup.string()
    .min(10, "Invalid phone numver")
    .required("Required"),
  gender: Yup.string().required("Required"),
  dateOfBirth: Yup.date().required("Required"),
  onLeave: Yup.boolean(),
  isActive: Yup.boolean(),
  address: Yup.object().shape({
    street: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    state: Yup.string().required("Required"),
    zipCode: Yup.string().required("Required"),
    country: Yup.string().required("Required"),
  }),
  role: Yup.string().required("Required"),
  shift: Yup.string().required("Required"),
  salary: Yup.number().min(0, "Cannot be negative").required("Required"),
});

const ProfileReci = () => {
  const {
    getEmployeedetialsWithToken,
    updateEmployeeDetialsWithToken,
    empUploadPic,
  } = useContext(UserContext);
  const [admin, setAdmin] = useState({});

  const [editingSection, setEditingSection] = useState(null);
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const fileInputRef = useRef(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["adminDetails"], // State ka parameter use kiya
    queryFn: getEmployeedetialsWithToken,
  });

  useEffect(() => {
    if (data?.status) {
      setAdmin(data?.employee);
    } else {
      toast.error(data?.message);
    }
  }, [data]);

  const originalValues = useRef(admin); // Add this line

  // Add useEffect to handle component mount

  const formik = useFormik({
    enableReinitialize: true, // Allow reinitialization
    initialValues: {
      ...admin,
      dateOfBirth: admin?.dateOfBirth?.split("T")[0],
    },
    validationSchema,
    onSubmit: async (values) => {
      const res = await updateEmployeeDetialsWithToken({
        name: values.name,
        phoneNumber: values.phoneNumber,
        gender: values.gender,
        dateOfBirth: values.dateOfBirth.toLocaleString(),
        onLeave: values.onLeave,
        isActive: values.isActive,
        address: values.address,
        role: values.role,
        shift: values.shift,
        salary: values.salary,
      });
      if (res?.status) {
        toast.success(res?.message);
        formik.resetForm();
        formik.setValues(values);
        setEditingSection(null);
        setIsEditingHeader(false);
      } else {
        toast.error(res?.message);
      }
    },
  });

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    const { avature, status, message } = await empUploadPic(formData);
    if (status) {
      toast.success(message);
      formik.setFieldValue("avature", avature);
    } else {
      toast.error(message);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setEditingSection(null);
    setIsEditingHeader(false);
  };

  const sectionVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  const formatLabel = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str?.toUpperCase());
  };

  const renderField = (name, value, section) => {
    const isEditing = editingSection === section || section === "header";
    let error = formik.errors[name];
    let touched = formik.touched[name];

    if (name.includes("address")) {
      const [parent, child] = name.split(".");
      error = formik.errors[parent]?.[child];
      touched = formik.touched[parent]?.[child];
    }

    if (!isEditing) {
      let displayValue = value;
      if (name === "dateOfBirth")
        displayValue = new Date(value).toLocaleDateString();
      if (name === "salary")
        displayValue = `$${Number(value).toLocaleString()}`;
      if (typeof value === "boolean") displayValue = value ? "Yes" : "No";
      return <p className="text-gray-800">{displayValue}</p>;
    }

    switch (name) {
      case "createdAt":
        return <p className="text-gray-800">{value}</p>;
      case "updatedAt":
        return <p className="text-gray-800">{value}</p>;
      case "email":
        return (
          <div className="flex items-center">
            <FaEnvelope className="text-gray-400 mr-2" />
            <p className="text-gray-800">{value}</p>
          </div>
        );
      case "employeeId":
        return (
          <div className="relative">
            <p className="text-gray-800"> {value}</p>
          </div>
        );
      case "gender":
        return (
          <select
            name={name}
            value={value}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full p-2 border rounded ${
              error && touched ? "border-red-500" : ""
            }`}
          >
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
        );
      case "onLeave":
      case "isActive":
        return (
          <label className="flex items-center">
            <input
              type="checkbox"
              name={name}
              checked={value}
              onChange={formik.handleChange}
              className="h-5 w-5 mr-2"
            />
            <span className="text-gray-700">{value ? "Yes" : "No"}</span>
          </label>
        );
      case "dateOfBirth":
        return (
          <input
            type="date"
            name={name}
            value={value}
            onChange={formik.handleChange}
            className={`w-full p-2 border rounded ${
              error && touched ? "border-red-500" : ""
            }`}
          />
        );
      case "salary":
        return (
          <div className="relative">
            <p className="text-gray-800">${value}</p>
          </div>
        );
      case "phoneNumber":
        return (
          <div className="flex items-center">
            <FaPhone className="text-gray-400 mr-2" />
            <input
              type="tel"
              name={name}
              value={value}
              onChange={formik.handleChange}
              className={`w-full p-2 border rounded ${
                error && touched ? "border-red-500" : ""
              }`}
              pattern="\+\d{1,3} \d{3}-\d{3}-\d{4}"
            />
          </div>
        );
      default:
        if (name.startsWith("address")) {
          const fieldName = name.split(".")[1];
          return (
            <input
              type="text"
              name={name}
              value={value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2 border rounded ${
                error && touched ? "border-red-500" : ""
              }`}
              placeholder={`Enter ${formatLabel(fieldName)}`}
            />
          );
        }
        return (
          <input
            type="text"
            name={name}
            value={value}
            onChange={formik.handleChange}
            className={`w-full p-2 border rounded ${
              error && touched ? "border-red-500" : ""
            }`}
          />
        );
    }
  };

  const renderSection = (title, icon, fields = {}, section) => (
    <motion.div
      variants={sectionVariants}
      className="bg-white rounded-sm p-6 shadow-sm mb-6"
    >
      <div className="flex items-center mb-4">
        {icon}
        <h2 className="text-xl font-semibold ml-2">{title}</h2>
        {editingSection !== section && (
          <button
            onClick={() => setEditingSection(section)}
            className="ml-auto text-blue-600 hover:text-blue-800"
          >
            <FaEdit className="inline-block" />
          </button>
        )}
        {editingSection === section && (
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={() => formik.handleSubmit()}
              className="text-green-600 hover:text-green-800"
            >
              <FaSave className="inline-block" />
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="text-red-600 hover:text-red-800"
            >
              <FaTimes className="inline-block" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(fields).map(([key, value]) => (
          <div key={key} className="mb-2">
            <label className="text-gray-600 text-sm block mb-1">
              {formatLabel(key)}
            </label>
            <div className="relative">
              {renderField(
                key.includes("address") ? `address.${key}` : key,
                value,
                section
              )}
              {formik.errors[key] && formik.touched[key] && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors[key]}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  return isLoading ? (
    <LoadingPage />
  ) : (
    <div className="p-4">
      <form className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center mb-8 relative bg-white p-6 rounded-sm shadow-sm"
        >
          {/* Avatar */}
          <div className="relative group">
            <div
              className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mr-6 cursor-pointer overflow-hidden"
              onClick={() => isEditingHeader && fileInputRef.current.click()}
            >
              {formik.values.avature &&
              formik.values.avature !== "default.png" ? (
                <img
                  src={formik.values.avature}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUser className="text-3xl text-gray-400" />
              )}
              {isEditingHeader && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <FaCamera className="text-white text-2xl" />
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Name and Role */}
          <div className="flex-1 text-start">
            {isEditingHeader ? (
              <div className="flex items-center gap-4">
                <input
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="text-3xl font-bold bg-transparent border-b-2 border-gray-300 focus:outline-none"
                />
                {formik.errors.name && formik.touched.name && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.name}
                  </div>
                )}
              </div>
            ) : (
              <h1 className="text-3xl font-bold">{formik.values.name}</h1>
            )}
            <p className="text-gray-600">{formik.values.role}</p>
          </div>

          {/* Edit/Save/Cancel Buttons */}
          <div className="ml-auto flex gap-2">
            {!isEditingHeader ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsEditingHeader(true); // Correct usage
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                <FaEdit className="text-2xl" />
              </button>
            ) : (
              <>
                <button
                  type="submit"
                  className="text-green-600 hover:text-green-800"
                  onClick={(e) => {
                    e.preventDefault();
                    formik.handleSubmit();
                  }}
                >
                  <FaSave className="text-2xl" />
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTimes className="text-2xl" />
                </button>
              </>
            )}
          </div>
        </motion.div>

        {/* Sections */}
        {renderSection(
          "Personal Information",
          <FaUser className="text-gray-600" />,
          {
            gender: formik.values.gender,
            dateOfBirth: formik.values.dateOfBirth,
            onLeave: formik.values.onLeave,
            isActive: formik.values.isActive,
          },
          "personal"
        )}

        {renderSection(
          "Contact Information",
          <FaEnvelope className="text-gray-600" />,
          {
            email: formik.values.email,
            phoneNumber: formik.values.phoneNumber,
          },
          "contact"
        )}

        {renderSection(
          "Address Information",
          <FaMapMarkerAlt className="text-gray-600" />,
          formik.values.address,
          "address"
        )}

        {renderSection(
          "Employment Information",
          <FaBriefcase className="text-gray-600" />,
          {
            employeeId: formik.values.employeeId,
            shift: formik.values.shift,
            salary: formik.values.salary,
            createdAt: new Date(formik.values.createdAt).toLocaleDateString(),
            updatedAt: new Date(formik.values.updatedAt).toLocaleDateString(),
          },
          "employment"
        )}
      </form>
    </div>
  );
};

export default ProfileReci;
