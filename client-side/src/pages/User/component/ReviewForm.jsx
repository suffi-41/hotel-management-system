import { useState } from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

const ReviewForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    rating: 5,
    comment: "",
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!formData.comment.trim()) {
      setError("Please enter your review");
      return;
    }
    onSubmit(formData);
    setFormData({
      rating: 5,
      comment: "",
    });
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      id="review-form"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-4">Write a Review</h3>
      {error && (
        <motion.div
          className="bg-red-50 text-red-500 p-3 rounded-md mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-start text-gray-300 text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <motion.button
                key={value}
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setFormData({ ...formData, rating: value })}
                onMouseEnter={() => setHoverRating(value)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none"
              >
                <FaStar
                  className={`h-6 w-6 ${
                    value <= (hoverRating || formData.rating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <textarea
            id="comment"
            rows={4}
            value={formData.comment}
            onChange={(e) =>
              setFormData({ ...formData, comment: e.target.value })
            }
            className="input w-full outline-none border-none"
            placeholder="Share your experience..."
          />
        </div>

        <motion.button
          type="submit"
          className="btn btn-primary w-full bg-gray-200 p-2 w-auto"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Submit Review
        </motion.button>
      </form>
    </motion.div>
  );
};

export default ReviewForm;
