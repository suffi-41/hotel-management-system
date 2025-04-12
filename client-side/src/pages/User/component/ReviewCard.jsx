import { motion } from "framer-motion";
// import { CiStar } from '@heroicons/react/24/solid'
import { FaStar } from "react-icons/fa";
import { format } from "date-fns";

const ReviewCard = ({ user, createdAt: date, comment, rating }) => {
  const { avature: avatar, name: author } = user;
  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start space-x-4">
        <img
          src={avatar}
          alt={author}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900">{author}</h4>
            <span className="text-sm text-gray-500">
              {format(new Date(date), "MMM d, yyyy")}
            </span>
          </div>
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                className={`h-4 w-4 ${
                  index < rating ? "text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="mt-3 text-gray-600 text-start">{comment}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewCard;
