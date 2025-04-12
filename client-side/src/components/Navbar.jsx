import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import UserAvature from "./UserAvature";
import { FaRegHeart, FaBed, FaCogs, FaEnvelope } from "react-icons/fa";
import { MdHome } from "react-icons/md";

const Navbar = ({ scrollY }) => {
  const { pathname } = useLocation();
  const { isLogged } = useSelector((state) => state.isLoggedReducer);
  const { userAvature: avature } = useSelector(
    (state) => state.userAvatureReducer
  );
  const [isTrue, setIsTrue] = useState(false);
  useEffect(() => {
    if (pathname !== "/" && !pathname.startsWith("/authentication")) {
      setIsTrue(true);
    } else if (scrollY < 20) {
      setIsTrue(false);
    } else {
      setIsTrue(true);
    }
  }, [scrollY || pathname]);

  return (
    <nav
      className={` ${
        !isTrue ? "bg-transparent fixed" : "bg-white shadow-lg sticky"
      } z-100 transition-all duration-1000 shadow-lg  top-0 right-0  w-full  z-50
    h-16`}
    >
      <motion.div
        initial={{ opacity: 0, y: -80 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4"
      >
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div
            className={`text-2xl font-bold ${
              isTrue ? "text-black" : "text-white"
            } whitespace-nowrap`}
          >
            <h1>Hotel Management</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-10 justify-center items-center">
            <Link
              to="/"
              className={`${
                isTrue ? "text-black" : "text-white"
              } hover:text-yellow-300`}
            >
              Home
            </Link>
            <Link
              to="/Facilities"
              className={`${
                isTrue ? "text-black" : "text-white"
              } hover:text-yellow-300`}
            >
              Facilities
            </Link>
            <Link
              to="/contact"
              className={`${
                isTrue ? "text-black" : "text-white"
              } hover:text-yellow-300`}
            >
              Contact Us
            </Link>
            {isLogged ? (
              <UserAvature imagesUrl={avature} />
            ) : (
              <Link
                to="/authentication"
                className={`${
                  isTrue ? "text-black" : "text-white"
                } hover:text-yellow-300`}
              >
                Login
              </Link>
            )}
          </div>
          {/* Mobile Menu top items */}
          <div className="md:hidden flex justify-around itmes-center gap-3">
            <Link
              to="/authentication"
              className={`${
                isTrue ? "text-black" : "text-white"
              } hover:text-yellow-300`}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-full h-full"
              >
                <FaRegHeart className="w-full h-full text-3xl" />
              </motion.div>
            </Link>
            {isLogged ? (
              <UserAvature imagesUrl={avature} />
            ) : (
              <Link
                to="/authentication"
                className={`${
                  isTrue ? "text-black" : "text-white"
                } hover:text-yellow-300`}
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu bottom items */}

        <div
          className={`  ${!isTrue ? "bg-transparent" : "bg-white shadow-lg"} ${
            pathname.startsWith("/user-dashboard") ? "hidden" : " "
          } md:hidden fixed flex bottom-0 left-0 backdrop-blur-md w-full justify-between p-2`}
        >
          <Link
            to="/"
            className={`block py-2 px-4 ${
              isTrue ? "text-black" : "text-white"
            }`}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-full h-full"
            >
              <MdHome className="w-full h-full text-3xl" />
            </motion.div>
          </Link>
          <Link
            to="/all-rooms"
            className={`block py-2 px-4 ${
              isTrue ? "text-black" : "text-white"
            }`}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-full h-full"
            >
              <FaBed className="w-full h-full text-3xl" />
            </motion.div>
          </Link>
          <Link
            href="/Facilities"
            className={`block py-2 px-4 ${
              isTrue ? "text-black" : "text-white"
            }`}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-full h-full"
            >
              <FaEnvelope className="w-full h-full text-3xl" />
            </motion.div>
          </Link>

          <Link
            to="/contact"
            className={`block py-2 px-4 ${
              isTrue ? "text-black" : "text-white"
            }`}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-full h-full"
            >
              <FaEnvelope className="w-full h-full text-3xl" />
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
