'use client'
import React from "react";

const orders = [
  {
    id: "00001",
    name: "Christine Brooks",
    address: "14, Jalan Jambu, Kabupaten Bogor",
    date: "04 Sep 2019",
    type: "Puyuh Potong",
    status: "Completed",
  },
  {
    id: "00002",
    name: "Rosie Pearson",
    address: "Jalan Pajajaran, 12970",
    date: "28 May 2019",
    type: "Puyuh",
    status: "Processing",
  },
  {
    id: "00003",
    name: "Darrell Caldwell",
    address: "Jalan Lodaya II",
    date: "23 Nov 2019",
    type: "Telur Puyuh",
    status: "Rejected",
  },
  {
    id: "00004",
    name: "Gilbert Johnston",
    address: "JL Kumbang No.14, RT.02/RW.06",
    date: "05 Feb 2019",
    type: "Telur Puyuh",
    status: "Completed",
  },
  {
    id: "00005",
    name: "Alan Cain",
    address: "JL Raya Pajajaran No.15",
    date: "29 Jul 2019",
    type: "Puyuh Potong",
    status: "Processing",
  },
  {
    id: "00006",
    name: "Alfred Murray",
    address: "JL Raya Pajajaran No.16",
    date: "15 Aug 2019",
    type: "Telur Puyuh",
    status: "Completed",
  },
  {
    id: "00007",
    name: "Maggie Sullivan",
    address: "JL Raya Darmaga Kampus IPB, Babakan, Kec. Dramaga",
    date: "21 Dec 2019",
    type: "Puyuh",
    status: "Processing",
  },
  {
    id: "00008",
    name: "Rosie Todd",
    address: "JL Salemba Raya 4, Jakarta Pusat",
    date: "30 Apr 2019",
    type: "Puyuh",
    status: "On Hold",
  },
  {
    id: "00009",
    name: "Dollie Hines",
    address: "JL Margonda Raya, Pondok Cina",
    date: "09 Jan 2019",
    type: "Puyuh Potong",
    status: "In Transit",
  },
];

const statusColors: Record<string, string> = {
  Completed: "bg-[#b6f5e6] text-[#2dbd7f]",
  Processing: "bg-[#e6e1fa] text-[#8d7fc7]",
  Rejected: "bg-[#ffeaea] text-[#f25c5c]",
  "On Hold": "bg-[#fff3d6] text-[#f6a700]",
  "In Transit": "bg-[#e6e1fa] text-[#8d7fc7]",
};

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-[#f6f3e7] p-8">
      <h1 className="text-3xl font-semibold mb-6">Order Lists</h1>
      {/* Filter Bar */}
      <div className="flex items-center gap-4 bg-white rounded-2xl px-6 py-4 mb-6">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-[#f6f3e7]">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="#2d2d2d" strokeWidth="2" />
            <rect x="10" y="7" width="4" height="2" fill="#2d2d2d" />
            <rect x="8" y="11" width="8" height="2" fill="#2d2d2d" />
            <rect x="11" y="15" width="2" height="2" fill="#2d2d2d" />
          </svg>
          Filter By
        </button>
        <select className="px-4 py-2 rounded-lg border border-gray-200 bg-white">
          <option>Date</option>
        </select>
        <select className="px-4 py-2 rounded-lg border border-gray-200 bg-white">
          <option>Order Type</option>
        </select>
        <select className="px-4 py-2 rounded-lg border border-gray-200 bg-white">
          <option>Order Status</option>
        </select>
        <button className="ml-auto flex items-center gap-2 text-[#f25c5c] font-medium hover:underline">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path d="M12 4v16m8-8H4" stroke="#f25c5c" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Reset Filter
        </button>
      </div>
      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#f6f3e7] text-[#2d2d2d]">
              <th className="py-3 px-4 font-medium">ID</th>
              <th className="py-3 px-4 font-medium">NAME</th>
              <th className="py-3 px-4 font-medium">ADDRESS</th>
              <th className="py-3 px-4 font-medium">DATE</th>
              <th className="py-3 px-4 font-medium">TYPE</th>
              <th className="py-3 px-4 font-medium">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={order.id} className={idx % 2 === 0 ? "bg-white" : "bg-[#f6f3e7]"}>
                <td className="py-3 px-4">{order.id}</td>
                <td className="py-3 px-4">{order.name}</td>
                <td className="py-3 px-4">{order.address}</td>
                <td className="py-3 px-4">{order.date}</td>
                <td className="py-3 px-4">{order.type}</td>
                <td className="py-3 px-4">
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${statusColors[order.status] || "bg-gray-200"}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination and info */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-gray-500 text-sm">
          Showing 1-09 of 78
        </div>
        <div className="flex gap-2">
          <button className="bg-white rounded-full p-2 border">
            &lt;
          </button>
          <button className="bg-white rounded-full p-2 border">
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}