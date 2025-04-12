import { useEffect } from "react";
import Footer from "../pages/Admin/authentication/conponent/Footer";
import Navbar from "../pages/Admin/authentication/conponent/Navbar";

export default function Authentication({ children }) {
  return (
    <div className="h-screen w-screen  bg-gray-100 flex  flex-col justify-between items-center ">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
