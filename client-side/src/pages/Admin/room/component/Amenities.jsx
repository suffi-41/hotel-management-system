import React from "react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";

export default function Amenities({ exportAmenity, importAmenity = [] }) {
  const [amenities, setAmenities] = useState(importAmenity || []);
  const [newAmenity, setNewAmenity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const addAmenity = async () => {
    if (!newAmenity.trim() && "Add Amenity ..." === newAmenity) {
      toast.error("Amenity name cannot be empty");
    } else {
      setAmenities([newAmenity, ...amenities]);
      exportAmenity([newAmenity, ...amenities]);
    }
    setNewAmenity("");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-lg text-black max-w-md "
    >
      <div className="flex items-center b p-2 shadow-sm mt-2 ">
        <input
          type="text"
          placeholder="Add amenity ..."
          value={newAmenity}
          onChange={(e) => {
            setNewAmenity(e.target.value);
            if (newAmenity === "") {
              e.target.value = "";
            }
          }}
          className="w-full px-4 px-2 border-none rounded-l-lg outline-none"
        />
        <span
          className="bg-blue-100 text-blue-700 p-2 rounded-sm cursor-pointer"
          onClick={addAmenity}
        >
          Add
        </span>
      </div>
      {amenities?.length !== 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          duration={0.3}
          className="flex flex-wrap gap-2 mt-2 bg-white p-2"
        >
          {amenities?.map((element, index) => {
            return (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                key={index}
                className="bg-gray-50 text-sm rounded-sm px-4 py-2 relative"
              >
                {element}
                <RxCross2
                  className="ml-2 cursor-pointer text-red-500 inline absolute top-0 bg-white right-0"
                  onClick={() => {
                    const updatedAmenities = amenities.filter(
                      (amenity, i) => i !== index
                    );
                    setAmenities(updatedAmenities);
                    exportAmenity(updatedAmenities);
                  }}
                />
              </motion.span>
            );
          })}
          <span
            onClick={() => setAmenities([])}
            title="Clear"
            className="bg-red-50 text-sm text-red-700 text-sm rounded-sm px-4 py-2 cursor-pointer"
          >
            Clear
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
