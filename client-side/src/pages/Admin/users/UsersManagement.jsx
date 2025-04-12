import React, {
  lazy,
  Suspense,
  startTransition,
  useState,
  useContext,
  useMemo,
  useEffect,
} from "react";
import { useTable } from "react-table";
import { motion, MotionConfig } from "framer-motion";
import UserAvature from "../../../components/UserAvature";
import { IoIosAddCircleOutline } from "react-icons/io";
import { UserContext } from "../../../state/User";
import { IoFilterSharp } from "react-icons/io5";
import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaUserCog,
  FaBed,
  FaDoorOpen,
  FaTools,
  FaWrench,
} from "react-icons/fa"; // Import icons
import { Link } from "react-router-dom";
import DeleteModal from "../../../components/DeleteModal";

//useQuery
import { useQuery } from "@tanstack/react-query";

// redux
import { actionCreator } from "../../../redux";
import { bindActionCreators, combineReducers } from "redux";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function UsersManagemant() {
  //
  const dispatch = useDispatch();
  const action = bindActionCreators(actionCreator, dispatch);
  const { SetUsers } = action;
  const { getAllUsers, blockedAndUnblockuser } = useContext(UserContext);

  // useQuery for fetch employees details
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["fetchUsers"],
    queryFn: getAllUsers,
  });

  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const handleBlockAndUblock = (id, status) => {
    startTransition(async () => {
      setUserId(id);
      setIsBlocked(status);
      setIsOpenDeleteModal(true);
    });
  };

  const onConfirmDelete = async (id) => {
    const response = await blockedAndUnblockuser(id);
    const { status, message } = await response;
    if (status) {
      toast.success(message);
      setIsOpenDeleteModal(false);
      refetch();

    } else {
      toast.error(message);
    }
  };

  useEffect(() => {
    if (data?.users && data?.status) {
      SetUsers(data?.users);
    }
  }, [data]);

  const { Users } = useSelector((state) => state.UserReducer);
  const columns = useMemo(
    () => [
      {
        Header: "Avature",
        accessor: "avature",
        Cell: ({ value }) => (
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <UserAvature imagesUrl={value} />
          </div>
        ),
      },
      { Header: "Name", accessor: "name" },
      { Header: "Email", accessor: "email" },
      { Header: "Phone No", accessor: "phoneNumber" },
      { Header: "Gender", accessor: "gender" },

      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              onClick={() =>
                handleBlockAndUblock(row.original._id, row.original.isBlocked)
              }
              className={`text-white px-3 py-1 rounded shadow ${
                row.original.isBlocked
                  ? "bg-green-500 text-green-600"
                  : "bg-red-500 text-red-600"
              }hover:bg-red-600`}
            >
              {!row.original.isBlocked ? "Blocked" : "Unblock"}
            </button>
            <Link
              to={`/admin/dashboard/users/user-profile/${row.original._id}`}
              className="bg-gray-500 text-white px-3 py-1 rounded shadow hover:bg-gray-600"
            >
              View
            </Link>
          </div>
        ),
      },
    ],
    []
  );
  const tableInstance = useTable({
    columns,
    data: Users || [], // Always pass the data, even if it's empty
  });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    !isLoading && (
      <div className="w-full h-full">
        <section
          id="overview"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5"
        >
          {/* Total Employees */}
          <div className="bg-white p-4 shadow-md rounded-lg flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FaUsers className="text-blue-500 text-2xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Total Users</h3>
              <p className="text-2xl">{Users?.length}</p>
            </div>
          </div>

          {/* Active Employees */}
          <div className="bg-white p-4 shadow-md rounded-lg flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <FaUserCheck className="text-green-500 text-2xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Active Users</h3>
              <p className="text-2xl">
                {Users?.filter((user) => !user.isBlocked).length}
              </p>
            </div>
          </div>

          {/* Inactive Employees */}
          <div className="bg-white p-4 shadow-md rounded-lg flex items-center">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <FaUserTimes className="text-red-500 text-2xl" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Blocked Users</h3>
              <p className="text-2xl">
                {Users?.filter((user) => user.isBlocked).length}
              </p>
            </div>
          </div>
        </section>
        {/* <motion.div
          className="flex justify-between items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span
            className="flex items-center mb-4 bg-gray-100 min-w-40 max-w-60 cursor-pointer px-4 py-2 rounded-lg shadow-md"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <IoFilterSharp className="mr-2" />
            Filter by
            <select className="ml-2 bg-gray-100 cursor-pointer outline-none">
              <option value="all">All</option>
              <option value="manager">Manager</option>
              <option value="receptionist">Receptionist</option>
              <option value="cleaner">Cleaner</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </span>
        </motion.div> */}
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
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                      className="px-4 py-2 border border-gray-300"
                    >
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <motion.tbody {...getTableBodyProps()} className="bg-white">
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <motion.tr
                    {...row.getRowProps()}
                    whileTap={{ scale: 0.98 }}
                    className="hover:bg-gray-100"
                  >
                    {row.cells.map((cell) => (
                      <motion.td
                        {...cell.getCellProps()}
                        className="px-4 py-2 border border-gray-300"
                      >
                        {cell.render("Cell")}
                      </motion.td>
                    ))}
                  </motion.tr>
                );
              })}
            </motion.tbody>
          </table>
        </motion.div>
        {/* Unblock Modal */}
        {isOpenDeleteModal && (
          <DeleteModal
            isOpen={isOpenDeleteModal}
            onClose={() => setIsOpenDeleteModal(false)}
            onConfirm={() => onConfirmDelete(userId)}
            content={` ${isBlocked ? "Unblock" : "Block"} this user`}
          />
        )}
      </div>
    )
  );
}
