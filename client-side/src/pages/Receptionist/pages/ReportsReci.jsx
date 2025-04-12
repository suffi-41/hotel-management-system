import { FiBarChart2 } from "react-icons/fi";
import { motion } from "framer-motion";
import { RoomContext } from "../../../state/Room";
import { useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function ReportsReci() {
  const [reportData, setReportData] = useState([]);
  const { getMonthlyRevenue } = useContext(RoomContext);
  const { data, isLoading } = useQuery({
    queryKey: ["getMonthlyRevenue"],
    queryFn: getMonthlyRevenue,
  });

  useEffect(() => {
    if (!data?.status) {
      toast.error(data?.message);
    } else {
      setReportData(data?.data);
    }
    return () => {
      setReportData([]);
    };
  }, [data]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FiBarChart2 /> Reports
      </h1>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">Month</th>
              <th className="text-left p-3">Revenue</th>
              <th className="text-left p-3">Bookings</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((report, index) => (
              <tr key={index} className="border-b">
                <td className="p-3 text-start">{report.month}</td>
                <td className="p-3 text-start">${report.revenue}</td>
                <td className="p-3 text-start">{report.bookings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
