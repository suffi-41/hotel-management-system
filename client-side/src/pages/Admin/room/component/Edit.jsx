import React, { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addRoomvalidationSchema } from "../../../../scema";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";

import { useQuery } from "@tanstack/react-query";
import { RoomContext } from "../../../../state/Room";
import Amenities from "./Amenities";

export default function Edit({
  closeModal,
  updateFunction,
  addRoomImages,
  id,
  refresh,
}) {
  const { getOneRoomDetials } = useContext(RoomContext);
  const { data, isLoading, error } = useQuery({
    queryKey: ["getAllRooms", id],
    queryFn: () => getOneRoomDetials(id),
  });

  const [initialValues, setInitialValues] = useState({
    roomNumber: "",
    type: "",
    price: "",
    status: "",
    description: "",
    capacity: "",
  });

  useEffect(() => {
    if (data?.status) {
      setInitialValues({
        roomNumber: data?.room?.roomNumber || "",
        type: data?.room?.type || "",
        price: data?.room?.price || "",
        status: data?.room?.status || "",
        description: data?.room?.description || "",
        capacity: data?.room?.capacity || "",
      });
    } else {
      toast.error(data?.message);
    }
  }, [data]);
  const [animaties, setAnimaties] = useState(data?.room?.amenities);
  const [uploadedImages, setUploadedImages] = useState([]); // Initialize with existing images

  const handleImageUpload = (e) => {
    const files = e.target.files;
    const fileArray = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setUploadedImages((prevImages) => [...prevImages, ...fileArray]);
  };

  // Remove image
  const removeImage = (index) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: addRoomvalidationSchema,
    onSubmit: async (values) => {
      // Handle room details update (submit details)
      const response = await updateFunction(id, {
        type: values.type,
        price: values.price,
        status: values.status,
        description: values.description,
        capacity: values.capacity,
        amenities: animaties,
      });
      const { status, message } = await response;
      if (status) {
        refresh();
        toast.success(message);
        closeModal(false);
      } else {
        toast.error(message);
      }
    },
  });

  // Auto-calculate price and capacity based on room type
  useEffect(() => {
    let basePrice = 0;
    let baseCapacity = 1; // Default capacity is 1

    // Set pricing and capacity based on room type
    if (formik.values.type === "single") {
      basePrice = 100;
      baseCapacity = 1; // Single room capacity is 1
    } else if (formik.values.type === "double") {
      basePrice = 150;
      baseCapacity = 2; // Double room capacity is 2
    } else if (formik.values.type === "suite") {
      basePrice = 200;
      baseCapacity = 4; // Suite room capacity is 4
    }

    formik.setFieldValue("price", basePrice);
    formik.setFieldValue("capacity", baseCapacity);
  }, [formik.values.type]);

  // Handle Image Upload (on form submit)
  const handleImageSubmit = async () => {
    const formData = new FormData();
    formData.append("roomId", id);
    // Ensure that only files are appended to FormData
    uploadedImages?.map((image) => {
      if (image.file) {
        formData.append("images", image.file);
      }
    });
    // Handle image submission separately
    const response = await addRoomImages(formData);
    console.log(response);
    const { status, message } = await response;
    console.log(response);
    if (status) {
      toast.success(message);
      closeModal(false);
    } else {
      toast.error(message);
    }
  };

  return (
    !isLoading && (
      <div className="flex w-screen h-screen fixed top-0 left-0 items-center justify-center backdrop-blur-sm bg-transparent z-20">
        <div
          className="absolute right-5 cursor-pointer top-5 p-2 rounded-full text-2xl bg-white"
          onClick={() => closeModal(false)}
        >
          <RxCross2 />
        </div>
        <motion.div
          className="bg-white p-6 sm:p-8 md:p-10 rounded shadow-md w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl h-auto"
          initial={{ opacity: 0, y: 500 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-center mb-2">
            Edit Room Details
          </h2>
          <form onSubmit={formik.handleSubmit} className="space-y-4 p-2">
            {/* Grid Layout for Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
                  className={`mt-1 block w-full border ${
                    formik.touched.roomNumber && formik.errors.roomNumber
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2`}
                  placeholder="Enter room number"
                  disabled
                />
                {formik.touched.roomNumber && formik.errors.roomNumber ? (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.roomNumber}
                  </p>
                ) : null}
              </div>

              {/* Room Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Room Type
                </label>
                <select
                  name="type"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.type}
                  className={`mt-1 block w-full border ${
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
                {formik.touched.type && formik.errors.type ? (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.type}
                  </p>
                ) : null}
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
                  className={`mt-1 block w-full border ${
                    formik.touched.price && formik.errors.price
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2`}
                  placeholder="Price per night"
                  disabled
                />
                {formik.touched.price && formik.errors.price ? (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.price}
                  </p>
                ) : null}
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
                  className={`mt-1 block w-full border ${
                    formik.touched.capacity && formik.errors.capacity
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2`}
                  placeholder="Enter capacity"
                  disabled
                />
                {formik.touched.capacity && formik.errors.capacity ? (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.capacity}
                  </p>
                ) : null}
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
                  className={`mt-1 block w-full border ${
                    formik.touched.status && formik.errors.status
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2`}
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="maintenance">Under Maintenance</option>
                </select>
                {formik.touched.status && formik.errors.status ? (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.status}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
                className={`mt-1 block w-full border ${
                  formik.touched.description && formik.errors.description
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2`}
                placeholder="Enter room description"
              />
              {formik.touched.description && formik.errors.description ? (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.description}
                </p>
              ) : null}
            </div>
            {/* Amenity */}
            <Amenities
              importAmenity={data?.room?.amenities}
              exportAmenity={setAnimaties}
            />

            {/* Submit Button for Room Details */}
            <div>
              <motion.button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Update Room Details
              </motion.button>
            </div>
          </form>

          {/* Image Upload Section */}
          <div className="mt-2">
            <h3 className="text-lg font-semibold mb-2">Add Room Images</h3>
            <input
              type="file"
              multiple
              onChange={handleImageUpload}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
            />
            <div className="mt-4">
              {uploadedImages?.length > 0 && (
                <motion.div
                  className="space-x-4 overflow-x-auto"
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {uploadedImages?.map((image, index) => (
                    <motion.div key={index} className="relative inline-block">
                      <motion.img
                        src={image.preview ? image.preview : image}
                        alt={`Uploaded Image ${index + 1}`}
                        className="w-32 h-32 object-cover rounded-lg"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                      >
                        ✕
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
            <motion.button
              onClick={handleImageSubmit}
              className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Upload Images
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  );
}
