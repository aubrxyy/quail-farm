'use client';
import Link from "next/link";
import { useState } from "react";

export default function HistoryOrder() {
  // Contoh data pesanan, Anda bisa menggantinya dengan data yang diambil dari checkout
  const [orders, setOrders] = useState([
    {
      id: 1,
      items: [
        { name: "Puyuh", quantity: 2, price: 30000 },
        { name: "Telur Puyuh", quantity: 5, price: 40000 },
      ],
      total: 230000,
      date: "2023-10-01",
    },
    {
      id: 2,
      items: [
        { name: "Puyuh Potong", quantity: 1, price: 35000 },
      ],
      total: 35000,
      date: "2023-10-05",
    },
  ]);

  return (
    <div className='bg-[#F7F4E8] min-h-screen p-10 text-black'>
      <Link href="/user" className="mt-4 text-black hover:underline mb-10">
        &lt; Kembali ke userpage
      </Link>
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Riwayat Pesanan Saya</h1>
        
        {orders.length === 0 ? (
          <p className="text-gray-500">Anda belum memiliki pesanan.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="p-4 bg-white rounded-md shadow-md border">
                <h2 className="font-semibold text-lg">Pesanan ID: {order.id}</h2>
                <p className="text-sm text-gray-600">Tanggal: {order.date}</p>
                <div className="mt-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.name} (x{item.quantity})</span>
                      <span>Rp. {item.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold mt-2">
                  <span>Total:</span>
                  <span>Rp. {order.total.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
