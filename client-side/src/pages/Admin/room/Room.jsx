import { useEffect, useState, useContext } from "react";
import { FaStar } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { RoomContext } from "../../../state/Room";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import RoomSkeleton from "./Skeleton/RoomSkeleton";

//redux

const Room = () => {
  const navgate = useNavigate();
  const [selectedImage, setSelectedImage] = useState("");
  const [room, setRoom] = useState([]);
  const { id } = useParams();
  const { getOneRoomDetials } = useContext(RoomContext);
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["oneRoomDetials", id], // userId is part of the query key
    queryFn: () => getOneRoomDetials(id),
  });

  useEffect(() => {
    if (data?.room && data.status) {
      setRoom(data?.room);
      setSelectedImage(data?.room?.images[0]);
    }
    return () => {
      setRoom();
    };
  }, [data]);

  return (
    <div className="w-full h-full bg-white p-4 rounded-lg">
      <div className="flex justify-between itmes-center">
        <div className="bg-white px-2 mb-4 rounded shadow w-40 ">
          <h2 className="text-xx font-bold">
            Room {room?.roomNumber} - {room?.type}
          </h2>

          <div className="flex items-center mt-1">
            <FaStar className="text-yellow-500" />
            <span className="ml-1 text-lg font-semibold">{4}</span>
          </div>
        </div>
        <motion.div
          className="flex items-center mb-4 bg-white  cursor-pointer font-bold px-4 rounded-lg shadow-md "
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => navgate(-1)}
        >
          Back
        </motion.div>
      </div>

      <img
        src={selectedImage}
        alt="Room"
        className="w-full h-80 object-cover rounded-lg"
        loading="lazy"
      />
      <div className="flex space-x-2 mt-2 overflow-x-auto">
        {room?.images?.map((img, index) =>
          !img ? (
            <Loader2 className="w-10 h-10 text-gray-500 animate-spin" />
          ) : (
            <img
              key={index}
              src={img}
              loading="lazy"
              alt="Room Thumbnail"
              className="w-16 h-16 object-cover rounded cursor-pointer border-2 border-transparent hover:border-blue-500"
              onClick={() => setSelectedImage(img)}
            />
          )
        )}
      </div>

      <div className="mt-4 text-center">
        <p className="text-lg font-semibold">${room?.price} / night</p>
        <p className="text-gray-600">Capacity: {room?.capacity} Person</p>
        <p className="text-gray-500">
          Status:{" "}
          <span
            className={`font-semibold ${
              room?.status === "available" ? "text-green-600" : "text-red-600"
            }`}
          >
            {room?.status}
          </span>
        </p>
        <p className="text-gray-500">
          Created At: {new Date(room?.createdAt).toLocaleDateString()}
        </p>
        <p className="text-gray-500">
          Updated At: {new Date(room?.updatedAt).toLocaleDateString()}
        </p>
      </div>

      <p className="mt-4 text-gray-600 text-center">{room?.description}</p>

      <div className="mt-4">
        <h3 className="text-lg font-semibold text-center">Facilities:</h3>
        <ul className="list-disc list-inside text-gray-600 text-center">
          {room?.facilities?.map((facility, index) => (
            <li key={index}>{facility}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold">Comments:</h3>
        {room?.comments?.map((comment, index) => (
          <p key={index} className="text-gray-700">
            <strong>{comment.user}:</strong> {comment.text}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Room;
