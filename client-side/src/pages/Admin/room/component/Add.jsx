import React, { useState } from "react";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import { addRoomvalidationSchema } from "../../../../scema";
import { RxCross2 } from "react-icons/rx";
import { addRoomDetialsUrl } from "../../../../utils/api";
import { toast } from "react-toastify";
import Loadding from "../../../../components/Loadding";
import Amenities from "./Amenities";

export default function Add({ closeModal }) {
  const [imageFiles, setImageFiles] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoadding] = useState(false);
  const [amenities, setAmenities] = useState([]);

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const filePreviews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImageFiles((prev) => [...prev, ...filePreviews]);
  };

  // Remove image
  const removeImage = (index) => {
    const updatedImages = imageFiles.filter((_, i) => i !== index);
    setImageFiles(updatedImages);
  };

  const formik = useFormik({
    initialValues: {
      roomNumber: "",
      type: "",
      price: "",
      status: "available",
      capacity: "",
      description: "",
    },
    validationSchema: addRoomvalidationSchema,
    onSubmit: async (values) => {
      setLoadding(true);
      // Create FormData object
      const formData = new FormData();
      formData.append("roomNumber", values.roomNumber);
      formData.append("type", values.type);
      formData.append("price", values.price);
      formData.append("status", values.status);
      formData.append("capacity", values.capacity);
      formData.append("description", values.description);
      formData.append("amenities", JSON.stringify(amenities));
      console.log(amenities)
      // Append images to FormData
      imageFiles.map((image) => formData.append("images", image.file));

      try {
        // Send API request using fetch
        const response = await fetch(addRoomDetialsUrl, {
          method: "post",
          body: formData,
        });
        const responseData = await response.json();
        const { status, message, id } = responseData;
        if (status) {
          setLoadding(true);
          toast.success(message);
          setImageFiles([]);
          closeModal(false);
        } else {
          toast.info(message);
        }
      } catch (error) {
        console.error("Error submitting room details:", error);
      }
    },
  });

  // Auto-fill price based on room type
  const handleRoomtypeChange = (e) => {
    const selectedtype = e.target.value;
    formik.setFieldValue("type", selectedtype);
    const prices = {
      single: 100,
      double: 200,
      suite: 500,
    };
    if (prices[selectedtype]) {
      formik.setFieldValue("price", prices[selectedtype]);
    }
  };

  return !loading ? (
    <div className="flex w-screen h-screen fixed m-0 top-0 left-0 items-center z-10 justify-center backdrop-blur-sm bg-transparent">
      <div
        className="absolute right-5 cursor-pointer top-5 p-2 rounded-full text-2xl bg-white"
        onClick={() => {
          closeModal(false);
        }}
      >
        <RxCross2 className="text-black" />
      </div>
      <motion.div
        className="bg-white p-8 text-white rounded shadow-md md:h-auto w-full max-w-3xl" // Increased max-width for a wider edit-style modal
        initial={{ opacity: 0, y: 500 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-black">
          Add Room Details
        </h2>
        <form onSubmit={formik.handleSubmit} className="p-2 flex flex-wrap">
          {/* Grid Layout for Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {/* Room Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Room Number
              </label>
              <input
                type="text"
                name="roomNumber"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.roomNumber}
                className={`mt-1 block w-full border text-black ${
                  formik.touched.roomNumber && formik.errors.roomNumber
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2`}
                placeholder="Enter room number"
              />
              {formik.touched.roomNumber && formik.errors.roomNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.roomNumber}
                </p>
              )}
            </div>

            {/* Room type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Room type
              </label>
              <select
                name="type"
                onChange={handleRoomtypeChange}
                onBlur={formik.handleBlur}
                value={formik.values.type}
                className={`mt-1 block w-full border text-black ${
                  formik.touched.type && formik.errors.type
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2`}
              >
                <option value="">Select room type</option>
                <option value="single">Single</option>
                <option value="double">Double</option>
                <option value="suite">Suite</option>
              </select>
              {formik.touched.type && formik.errors.type && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.type}
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                name="price"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.price}
                className={`mt-1 block w-full border text-black ${
                  formik.touched.price && formik.errors.price
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2`}
                placeholder="Enter price per night"
              />
              {formik.touched.price && formik.errors.price && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.price}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.status}
                className={`mt-1 block w-full border text-black ${
                  formik.touched.status && formik.errors.status
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2`}
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Under Maintenance</option>
              </select>
              {formik.touched.status && formik.errors.status && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.status}
                </p>
              )}
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Capacity
              </label>
              <input
                type="number"
                name="capacity"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.capacity}
                className={`mt-1 block w-full border text-black ${
                  formik.touched.capacity && formik.errors.capacity
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2`}
                placeholder="Enter room capacity"
              />
              {formik.touched.capacity && formik.errors.capacity && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.capacity}
                </p>
              )}
            </div>
          </div>

          {/* Room Description */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
              className={`mt-1 block w-full border text-black ${
                formik.touched.description && formik.errors.description
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2`}
              placeholder="Enter room description"
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.description}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700">
              Upload Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              required
              onChange={handleImageUpload}
              className="mt-1 block w-full border text-black rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
            />
            {imageFiles.length > 0 && (
              <motion.div
                className="mt-4 flex space-x-4 overflow-x-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {imageFiles.map((image, index) => (
                  <motion.div
                    key={index}
                    className={`relative min-w-[100px] h-[100px] border rounded overflow-hidden ${
                      selectedImage === index ? "border-blue-500" : ""
                    }`}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image.preview}
                      alt={`Preview ${index}`}
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white text-xs p-1 rounded-full"
                    >
                      ✕
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}

            <Amenities exportAmenity={setAmenities} />
          </div>
          {/* Amenities */}

          {/* Submit Button */}
          <div className="mt-2">
            <motion.button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add Room
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  ) : (
    <Loadding />
  );
}
