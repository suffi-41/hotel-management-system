import React, { useEffect, useState, useContext } from "react";
import { VisualizedContext } from "../../../../state/Visualized";
import Chart from "../../../../components/Chart";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

const BookingChart = () => {
  const { getAllBookingVisualizedData } = useContext(VisualizedContext);
  const [filter, setFilter] = useState("7days");
  const [labels, setLabels] = useState("Last 7 days");
  const [BookinData, setBookingData] = useState({
    labels: [],
    counts: [],
  });
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["bookingChartData", filter],
    queryFn: () => getAllBookingVisualizedData(filter),
  });

  useEffect(() => {
    if (data?.status) {
      setBookingData(data);
    } else {
      toast.error(data?.message);
    }
  }, [data]);
  useEffect(() => {
    switch (filter) {
      case "7days":
        setLabels("Last 7 days");
        break;
      case "30days":
        setLabels("Last Month");
        break;
      case "3months":
        setLabels("Last 3 Months");
        break;
      case "6months":
        setLabels("Last 6 Months");
        break;
      case "lastyear":
        setLabels("Last Year");
        break;
      default:
        setLabels("Last 7 days");
        break;
    }
    refetch();
  }, [filter]);

  return (
    <div className="w-full bg-white p-2 shadow-sm rounded-sm ">
      <div className=" bg-blue-500 rounded-lg p-2 text-white font-semibold mb-4 flex justify-between">
        <h2 className="text-xl text-start">{labels}</h2>
        <div className="text-start ">
          <label htmlFor="statusFilter  " className="text-white">
            Filter by Status:
          </label>
          <select
            className="rounded-lg outline-none border-none text-black  ml-2 "
            id="statusFilter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="lastyear">Last Year</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Chart data={BookinData} title="Bookings" />
      )}
    </div>
  );
};

export default BookingChart;
