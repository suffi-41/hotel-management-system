import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsStarFill, BsStarHalf, BsStar } from "react-icons/bs"; // Import star icons
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const RoomCard = ({ room }) => {
  const isLogged = useSelector((state) => state.isLoggedReducer);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Handle next image
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === room.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Handle previous image
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? room.images.length - 1 : prevIndex - 1
    );
  };

  // Handle thumbnail click
  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  // Function to generate star rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<BsStarFill key={i} className="text-yellow-400" />);
      } else if (i - 0.5 === rating) {
        stars.push(<BsStarHalf key={i} className="text-yellow-400" />);
      } else {
        stars.push(<BsStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg flex md:flex-row flex-col justify-center gap-2 items-center shadow-md overflow-hidden w-full hover:shadow-lg transition-shadow duration-300 border border-gray-100 lg:w-3/4"
    >
      <div className="md:w-1/2 w-full h-full p-2">
        {/* Image Carousel */}
        <div className="relative w-full h-48">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={room.images[currentImageIndex]}
              alt={room.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover rounded-lg"
            />
          </AnimatePresence>

          {/* Navigation Buttons */}
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 text-gray-800 p-2 rounded-full hover:bg-opacity-100 transition duration-300 shadow-md"
          >
            &lt;
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 text-gray-800 p-2 rounded-full hover:bg-opacity-100 transition duration-300 shadow-md"
          >
            &gt;
          </button>
        </div>
        <div className="flex space-x-2 pt-2 overflow-x-auto">
          {room.images.map((image, index) => (
            <motion.img
              key={index}
              src={image}
              alt={`Thumbnail ${index + 1}`}
              onClick={() => handleThumbnailClick(index)}
              className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 ${
                index === currentImageIndex
                  ? "border-blue-500"
                  : "border-transparent"
              }`}
              whileHover={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </div>
      </div>

      <div className="md:w-1/2 w-full">
        {/* Room Details */}
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800">
            Room No: {room.roomNumber} ({room.type})
          </h2>
          <p className="text-gray-600 text-sm mt-1 text-justify">
            {room.description}
          </p>

          {/* Address */}
          <p className="text-gray-500 text-sm mt-2 flex items-center">
            <span className="mr-1">📍</span> {room.location}
          </p>

          {/* Rating */}
          <div className="flex items-center mt-2">
            {renderStars(room?.averageRating)}
            <span className="ml-2 text-gray-500 text-sm">
              {room.rating} ({room.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="mt-4 flex justify-between items-center">
            <div>
              <span className="text-lg font-semibold">${room.price}</span>
              <span className="text-sm text-gray-500"> / night</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Link
                to={`/room/${room._id}`}
                className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition duration-300 text-sm font-medium"
              >
                View
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RoomCard;
