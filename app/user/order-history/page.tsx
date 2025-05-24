"use client";
import Header from "@/app/_components/Header";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HistoryOrder() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/orders")
      .then(res => res.json())
      .then(setOrders);
  }, []);

  return (
    <>
    <Header />
    <div className='bg-[#F7F4E8] min-h-screen p-10 text-black pt-20'>
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
                <p className="text-sm text-gray-600">Tanggal: {new Date(order.orderDate).toLocaleDateString()}</p>
                <div className="mt-2">
                  {order.product && (
                    <div className="flex justify-between">
                      <span>{order.product.name} (x{order.orderAmount})</span>
                      <span>Rp. {order.totalPrice.toLocaleString()}</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between font-bold mt-2">
                  <span>Total:</span>
                  <span>Rp. {order.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
