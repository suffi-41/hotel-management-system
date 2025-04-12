import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import SearchRoom from "../components/SearchRoom";
import { useLocation } from "react-router-dom";
import { UserContext } from "../state/User";

//redux
import { actionCreator } from "../redux";
import { bindActionCreators } from "redux";
import { useDispatch, useSelector } from "react-redux";

//images
import image_1 from "../assets/index_1.jpg";
import image_2 from "../assets/about.jpg";
import image_3 from "../assets/milestones.jpg";
import image_4 from "../assets/pexels-quark-studio-1159039-2506988.jpg";
import image_5 from "../assets/pexels-fotoaibe-1743231.jpg";
import image_6 from "../assets/pexels-pixabay-258154.jpg";
import image_7 from "../assets/pexels-pixabay-262047.jpg";
import image_8 from "../assets/pexels-quark-studio-1159039-2507010.jpg";
import image_9 from "../assets/pexels-quark-studio-1159039-2507010.jpg";
import { toast } from "react-toastify";
const images = [
  image_1,
  image_2,
  image_3,
  image_4,
  image_5,
  image_6,
  image_7,
  image_8,
  image_9,
];

export default function Landding({ children }) {
  const dispatch = useDispatch();
  const action = bindActionCreators(actionCreator, dispatch);
  const { getUserAvature } = useContext(UserContext);

  //state
  const [scrollY, setScrollY] = useState(0);
  const [scrollLength, setScrollLength] = useState(0);

  const { isLogged } = useSelector((state) => state.isLoggedReducer);

  const [currentIndex, setCurrentIndex] = useState(0);
  const location = useLocation();
  const avatureGet = async () => {
    if (isLogged) {
      const response = await getUserAvature();

      if (response.status) {
        action.setUserAvatuer(response.avature, response.id);
      } else {
        toast.error(response.message);
      }
    }
  };

  useEffect(() => {
    avatureGet();
  }, [isLogged]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const handleScroll = (event) => {
    const element = event.target;
    setScrollY(element.scrollTop); // Current scroll position inside #landing-page
    setScrollLength(element.scrollHeight - element.clientHeight); // Total scrollable length
  };

  return (
    <div
      className="w-full h-full overflow-y-auto"
      id="landding-page"
      onScroll={handleScroll}
    >
      <Navbar scrollY={scrollY} scrollLength={scrollLength} />
      {(location.pathname.startsWith("/authentication") ||
        location.pathname === "/") && (
        <div className="relative w-full h-screen  flex justify-center items-center overflow-hidden">
          <AnimatePresence>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${images[currentIndex]})` }}
            ></motion.div>
          </AnimatePresence>
          {location.pathname.startsWith("/authentication") && !isLogged ? (
            children
          ) : (
            <SearchRoom />
          )}

          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  currentIndex === index ? "bg-white" : "bg-gray-400"
                }`}
              ></button>
            ))}
          </div>
        </div>
      )}
      {location.pathname.startsWith("/authentication") ? null : children}
      {/* <Footer/> */}
    </div>
  );
}
