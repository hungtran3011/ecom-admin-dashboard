import React from 'react';

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold">Total Products</h2>
          <p className="text-2xl font-bold">120</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold">Total Orders</h2>
          <p className="text-2xl font-bold">450</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-2xl font-bold">300</p>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <ul className="space-y-2">
          <li className="text-gray-700">User John placed an order (#12345).</li>
          <li className="text-gray-700">Product "Wireless Headphones" was added.</li>
          <li className="text-gray-700">User Jane updated her profile.</li>
        </ul>
      </div>

      {/* Data Table Section */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 p-2 text-left">Order ID</th>
              <th className="border border-gray-200 p-2 text-left">Customer</th>
              <th className="border border-gray-200 p-2 text-left">Total</th>
              <th className="border border-gray-200 p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 p-2">12345</td>
              <td className="border border-gray-200 p-2">John Doe</td>
              <td className="border border-gray-200 p-2">$120.00</td>
              <td className="border border-gray-200 p-2 text-green-600">Completed</td>
            </tr>
            <tr>
              <td className="border border-gray-200 p-2">12346</td>
              <td className="border border-gray-200 p-2">Jane Smith</td>
              <td className="border border-gray-200 p-2">$80.00</td>
              <td className="border border-gray-200 p-2 text-yellow-600">Pending</td>
            </tr>
            <tr>
              <td className="border border-gray-200 p-2">12347</td>
              <td className="border border-gray-200 p-2">Alice Brown</td>
              <td className="border border-gray-200 p-2">$150.00</td>
              <td className="border border-gray-200 p-2 text-red-600">Cancelled</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}