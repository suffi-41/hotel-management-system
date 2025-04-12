import { useState } from "react";
import { FiDollarSign, FiDownload, FiFilter, FiSearch } from "react-icons/fi";

const BillingHistory = () => {
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Temporary data
  const billingHistory = [
    {
      id: "INV-2308-001",
      date: "2023-08-15",
      amount: 1200.0,
      status: "paid",
      method: "Credit Card ****4242",
      description: "Deluxe Room Booking",
    },
    {
      id: "INV-2307-045",
      date: "2023-07-28",
      amount: 850.5,
      status: "paid",
      method: "PayPal",
      description: "Suite Upgrade",
    },
    {
      id: "INV-2308-078",
      date: "2023-08-20",
      amount: 450.0,
      status: "pending",
      method: "Bank Transfer",
      description: "Service Charges",
    },
    {
      id: "INV-2306-112",
      date: "2023-06-10",
      amount: 1200.0,
      status: "refunded",
      method: "Credit Card ****1881",
      description: "Cancellation Fee",
    },
  ];

  const statusColors = {
    paid: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    refunded: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3 mb-4">
          <FiDollarSign className="text-blue-500" />
          Billing History
        </h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative w-full md:w-64">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full md:w-48 px-4 py-2 border rounded-lg bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="text-gray-600 mb-2">Total Paid</div>
          <div className="text-2xl font-bold text-green-600">$3,500.50</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="text-gray-600 mb-2">Pending Payments</div>
          <div className="text-2xl font-bold text-yellow-600">$450.00</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="text-gray-600 mb-2">Upcoming Payments</div>
          <div className="text-2xl font-bold text-blue-600">$1,200.00</div>
        </div>
      </div>

      {/* Billing History Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Invoice ID</th>
              <th className="p-4 text-left">Description</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Payment Method</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {billingHistory.map((item) => (
              <tr
                key={item.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="p-4 font-medium">{item.id}</td>
                <td className="p-4 text-gray-600">{item.description}</td>
                <td className="p-4 text-gray-600">{item.date}</td>
                <td className="p-4 text-gray-600">{item.method}</td>
                <td className="p-4 font-semibold">${item.amount.toFixed(2)}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      statusColors[item.status]
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="p-4">
                  <button className="text-blue-500 hover:text-blue-700 flex items-center gap-1">
                    <FiDownload size={16} />
                    <span>Download</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* No Results */}
      {billingHistory.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No billing history found
        </div>
      )}
    </div>
  );
};

export default BillingHistory;
