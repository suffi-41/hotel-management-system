import React, { useContext, useMemo } from "react";
import { useTable } from "react-table";
import { motion } from "framer-motion";
import { format, differenceInDays, parseISO } from "date-fns";
import { useParams, Link, useNavigate } from "react-router-dom";
import { RoomContext } from "../../../state/Room";
import { useQuery } from "@tanstack/react-query";

const RoomHistory = () => {
  const { getRoomBookingHistory } = useContext(RoomContext);
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch room booking history data
  const { data, isLoading, error } = useQuery({
    queryKey: ["roomHistory", id],
    queryFn: () => getRoomBookingHistory(id),
  });

  // Define table columns
  const columns = useMemo(
    () => [
      {
        Header: "Guest Avatar",
        accessor: "guestId.avature",
        Cell: ({ value }) => (
          <img
            src={value}
            alt="Guest Avatar"
            className="w-10 h-10 rounded-full"
          />
        ),
      },
      {
        Header: "Guest Name",
        accessor: "guestName",
      },
      {
        Header: "Check-In Date",
        accessor: "checkInDate",
        Cell: ({ value }) => format(parseISO(value), "dd/MM/yyyy hh:mm a"),
      },
      {
        Header: "Check-Out Date",
        accessor: "checkOutDate",
        Cell: ({ value }) => format(parseISO(value), "dd/MM/yyyy hh:mm a"),
      },
      {
        Header: "Number of Days",
        accessor: "numberOfDays",
        Cell: ({ row }) =>
          differenceInDays(
            parseISO(row.original.checkOutDate),
            parseISO(row.original.checkInDate)
          ),
      },
      {
        Header: "Payment Status",
        accessor: "paymentStatus",
        Cell: ({ value = "paid" }) => {
          // Define colors based on payment status
          const statusColors = {
            Paid: "text-green-600 bg-green-100",
            Pending: "text-yellow-600 bg-yellow-100",
            Overdue: "text-red-600 bg-red-100",
          };
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                statusColors[value] || "text-gray-600 bg-gray-100"
              }`}
            >
              {value}
            </span>
          );
        },
      },
    ],
    []
  );

  // Redirect to user profile
  const onRedirect = (id) => {
    navigate(`/admin/dashboard/users/user-profile/${id}`);
  };

  // React Table instance
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: data?.history || [] });

  // Handle loading and error states

  return (
    !isLoading && (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <motion.span
            className="flex items-center bg-gray-100 min-w-40 max-w-60 cursor-pointer font-bold px-4 py-2 rounded-lg shadow-md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Room No: {data?.roomNumber}
          </motion.span>
          <Link to="/admin/dashboard/rooms">
            <motion.div
              className="flex items-center bg-gray-100 min-w-40 max-w-60 cursor-pointer font-bold px-4 py-2 rounded-lg shadow-md"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Back
            </motion.div>
          </Link>
        </div>

        <motion.div
          className="overflow-x-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <table
            {...getTableProps()}
            className="table-auto w-full text-left border-collapse border border-gray-300"
          >
            <thead className="bg-gray-100">
              {headerGroups?.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup?.headers?.map((column) => (
                    <th
                      {...column?.getHeaderProps()}
                      className="px-4 py-2 border border-gray-300"
                    >
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {!data?.status ? (
              <div className="text-center text-gray-500 w-full p-4">
                No booking history found for this room.
              </div>
            ) : (
              <motion.tbody
                {...getTableBodyProps()}
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1 },
                  },
                }}
                className="bg-white"
              >
                {rows?.map((row) => {
                  prepareRow(row);
                  return (
                    <motion.tr
                      {...row.getRowProps()}
                      whileTap={{ scale: 0.98 }}
                      className="hover:bg-gray-100"
                      onClick={() => onRedirect(row.original?.guestId?._id)}
                    >
                      {row.cells.map((cell) => (
                        <motion.td
                          {...cell.getCellProps()}
                          className="px-4 py-2 border border-gray-300"
                          variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1 },
                          }}
                        >
                          {cell.render("Cell")}
                        </motion.td>
                      ))}
                    </motion.tr>
                  );
                })}
              </motion.tbody>
            )}
          </table>
        </motion.div>
      </motion.div>
    )
  );
};

export default RoomHistory;
