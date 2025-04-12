import { motion } from "framer-motion";
import { CiStar} from "react-icons/ci";

const ReviewSummary = ({ rating, totalReviews }) => {
  return (
    <motion.div
      className="flex items-center space-x-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center">
        <CiStar className="h-6 w-6 text-yellow-400" />
        <span className="ml-1 text-xl font-semibold text-gray-900">
          {rating.toFixed(1)}
        </span>
      </div>
      <div className="h-6 w-px bg-gray-300" />
      <div className="text-gray-600">
        {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
      </div>
      <motion.div
        className="relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <a
          href="#reviews"
          className="text-primary font-medium hover:text-secondary transition-colors duration-200"
        >
          See all reviews
        </a>
      </motion.div>
    </motion.div>
  );
};

export default ReviewSummary;
