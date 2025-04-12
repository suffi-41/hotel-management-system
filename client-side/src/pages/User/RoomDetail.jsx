import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CiStar, CiCircleCheck } from "react-icons/ci";
import { ReviewsContext } from "../../state/Review";
import { FaArrowDownLong, FaArrowLeft } from "react-icons/fa6";

// import { format, addDays } from "date-fns";
import ReviewCard from "./component/ReviewCard";
import ReviewForm from "./component/ReviewForm";
import ReviewSummary from "./component/ReviewSummary";

import { RoomContext } from "../../state/Room";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

// const roomData = {
//   deluxe: {
//     id: "deluxe",
//     name: "Deluxe Ocean View Suite",
//     description:
//       "Spacious suite with breathtaking ocean views and modern amenities.",
//     price: 299,
//     averageRating: 4.8,
//     size: "45m²",
//     capacity: 3,
//     type: "King Size Bed",
//     images: [
//       "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3",
//       "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3",
//       "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3",
//     ],
//     amenities: [
//       "Ocean View",
//       "King Bed",
//       "Private Balcony",
//       "Mini Bar",
//       "Free Wi-Fi",
//       "Room Service",
//       "Air Conditioning",
//       "Flat-screen TV",
//       "Coffee Maker",
//       "In-room Safe",
//     ],
//     reviews: [
//       {
//         id: 1,
//         author: "Sarah Johnson",
//         rating: 5,
//         date: "2024-03-01",
//         comment:
//           "Absolutely stunning room with breathtaking ocean views! The service was impeccable, and the amenities exceeded our expectations. Will definitely return!",
//         avatar:
//           "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//       },
//       {
//         id: 2,
//         author: "Michael Chen",
//         rating: 4,
//         date: "2024-02-15",
//         comment:
//           "Great experience overall. The room was spacious and well-maintained. The ocean view was spectacular, especially during sunrise.",
//         avatar:
//           "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//       },
//     ],
//   },
//   executive: {
//     id: "executive",
//     name: "Executive Mountain Suite",
//     description:
//       "Luxurious suite with panoramic mountain views and premium furnishings.",
//     price: 399,
//     averageRating: 4.9,
//     size: "55m²",
//     capacity: 4,
//     type: "King Size Bed + Sofa Bed",
//     images: [
//       "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3",
//       "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3",
//       "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3",
//     ],
//     amenities: [
//       "Mountain View",
//       "King Bed",
//       "Jacuzzi",
//       "Fireplace",
//       "Free Wi-Fi",
//       "Room Service",
//       "Air Conditioning",
//       "Smart TV",
//       "Espresso Machine",
//       "Walk-in Closet",
//     ],
//     reviews: [
//       {
//         id: 1,
//         author: "Emma Wilson",
//         rating: 5,
//         date: "2024-02-28",
//         comment:
//           "The mountain views are absolutely breathtaking! The fireplace made our evenings so cozy. Truly a luxurious experience.",
//         avatar:
//           "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//       },
//       {
//         id: 2,
//         author: "David Thompson",
//         rating: 5,
//         date: "2024-02-10",
//         comment:
//           "Perfect for our family getaway. The suite is incredibly spacious, and the amenities are top-notch. Kids loved it!",
//         avatar:
//           "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//       },
//     ],
//   },
//   garden: {
//     id: "garden",
//     name: "Garden View Room",
//     description: "Cozy room with beautiful garden views and modern comforts.",
//     price: 199,
//     averageRating: 4.6,
//     size: "35m²",
//     capacity: 2,
//     type: "Queen Size Bed",
//     images: [
//       "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3",
//       "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3",
//       "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3",
//     ],
//     amenities: [
//       "Garden View",
//       "Queen Bed",
//       "Private Patio",
//       "Mini Fridge",
//       "Free Wi-Fi",
//       "Air Conditioning",
//       "LED TV",
//       "Tea/Coffee Maker",
//       "Digital Safe",
//       "Work Desk",
//     ],
//     reviews: [
//       {
//         id: 1,
//         author: "Lisa Martinez",
//         rating: 4,
//         date: "2024-02-25",
//         comment:
//           "Such a peaceful setting! The garden view was lovely, and the room was very comfortable. Great value for money.",
//         avatar:
//           "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//       },
//       {
//         id: 2,
//         author: "James Wilson",
//         rating: 5,
//         date: "2024-02-05",
//         comment:
//           "Perfect for a relaxing weekend. The garden views are beautiful, and the room is well-equipped with everything you need.",
//         avatar:
//           "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
//       },
//     ],
//   },
// };

const additionalServices = [
  { id: "breakfast", name: "Breakfast Buffet", price: 25 },
  { id: "airport", name: "Airport Transfer", price: 50 },
  { id: "spa", name: "Spa Access", price: 40 },
  { id: "parking", name: "Parking", price: 15 },
];

const RoomDetail = () => {
  const { addReviews } = useContext(ReviewsContext);
  const { getOneRoomDetials } = useContext(RoomContext);
  const { isLogged } = useSelector((state) => state.isLoggedReducer);
  const navigate = useNavigate();
  const [room, setRoom] = useState({});
  const [reviews, setReviews] = useState();
  const { id } = useParams();

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["oneRoomDetials", id], // userId is part of the query key
    queryFn: () => getOneRoomDetials(id),
  });

  useEffect(() => {
    if (data?.room && data?.status) {
      setRoom(data?.room);
      setReviews(data?.room?.reviews);
    }
    return () => {
      setRoom([]);
    };
  }, [data]);

  // Calculate Average Rating

  const [selectedImage, setSelectedImage] = useState(0);

  // const calculateTotal = () => {
  //   const checkInDate = new Date(formData.checkIn);
  //   const checkOutDate = new Date(formData.checkOut);
  //   const nights = Math.ceil(
  //     (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
  //   );

  //   const roomTotal = room?.price * nights || 2000;
  //   const servicesTotal = formData.services.reduce((total, serviceId) => {
  //     const service = additionalServices.find((s) => s.id === serviceId);
  //     return total + (service?.price || 0);
  //   }, 0);

  //   return {
  //     roomTotal,
  //     servicesTotal,
  //     total: roomTotal + servicesTotal,
  //     nights,
  //   };
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("Booking submitted:", { ...formData, roomType: room.id });
  // };

  const handleReviewSubmit = async (review) => {
    if (!isLogged) {
      navigate("/authentication");
    } else {
      const toastId = toast.loading("Processing...");
      // Add the new review to the room's reviews array
      const res = await addReviews(id, review);
      const { message, status, data } = await res;
      if (status) {
        const { newReview, averageRating } = data;

        setReviews((prevUsers) => [...reviews, newReview]);
        toast.update(toastId, {
          render: message,
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        toast.error(message);
      }
    }
  };

  // const totals = calculateTotal();

  if (!room) {
    return (
      <div className="h-screen bg-graroomy-50 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Room not found</h1>
        </div>
      </div>
    );
  }

  return !isLoading && room ? (
    <div className="pt-10 bg-gray-50">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-800 transition duration-300 px-2 mb-2 sticky top-20"
      >
        <FaArrowLeft className="w-5 h-5 mr-2" />
        <span className="text-lg font-semibold">Back</span>
      </button>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Room Images and Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10"
          >
            <div className="relative h-[400px] rounded-lg overflow-hidden mb-4">
              <img
                src={room?.images && room?.images[selectedImage]}
                alt={room?.roomNumber}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {room?.images?.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`h-24 rounded-lg overflow-hidden ${
                    selectedImage === index ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <img
                    src={image}
                    alt={`${room?.roomNumber} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Room No : {room?.roomNumber || "Add the name"}
                </h2>
                <ReviewSummary
                  rating={room?.averageRating || 0}
                  totalReviews={reviews?.length}
                />
              </div>
              <p className="text-gray-600 mb-6">{room?.description || "NaN"}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">
                    Max Occupancy:
                  </span>
                  <span className="ml-2 text-gray-600">
                    {room?.capacity} persons
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Room Type:</span>
                  <span className="ml-2 text-gray-600">{room?.type}</span>
                </div>
              </div>
              <Link
                to={isLogged ? `/booking-room/${room._id}` : "/authentication"}
                state={{
                  roomNumber: room.roomNumber,
                  capacity: room.capacity,
                  roomPrice: room.price,
                }}
                className="px-10 py-4  rounded-sm transition shadow-lg relative font-bold clear-both top-10 bg-blue-500 text-white "
              >
                Book Now
              </Link>
            </div>

             <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Amenities
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {room?.amenities?.map((amenity) => (
                  <div key={amenity} className="flex items-center">
                    <CiCircleCheck className="h-5 w-5 text-primary mr-2" />
                    <span className="text-gray-600">{amenity}</span>
                  </div>
                ))}
              </div>
            </div> 
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-10"
          >
            {/* Reviews Section */}
            <div className="mt-0 " id="reviews">
              <span className="text-xl font-bold text-gray-900 mb-4 sticky top-20 text-start bg-white shadow-md rounded-lg p-2 top-0">
                {reviews?.length > 0
                  ? " Guest Reviews (" + reviews?.length + ")"
                  : "No any Reviews"}
                <a href="#review-form">
                  <FaArrowDownLong className="inline" />
                </a>
              </span>
              <div className="space-y-6">
                {reviews?.map((review) => (
                  <ReviewCard key={review._id} {...review} />
                ))}
              </div>
              <div className="mt-5 shadow-md">
                <ReviewForm onSubmit={handleReviewSubmit} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  ) : (
    <div>Loading..</div>
  );
};

export default RoomDetail;
