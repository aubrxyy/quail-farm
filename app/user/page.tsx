"use client";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import Header from "../_components/Header";

export default function UserPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch("/api/auth/validate")
      .then(res => res.json())
      .then(data => setUser(data.user));
  }, []);

  return (
    <>
    <Header />
    <div className='bg-[#F7F4E8] min-h-screen pt-28 text-black px-40'>
      <div className="flex flex-col md:flex-row p-6">
        <div className="flex flex-col items-center md:w-1/3 mb-6 bg-[#E6DCB8] mr-8 rounded">
          <div className="w-24 h-24 rounded-full bg-gray-300 mb-4 mt-10"></div>
          <h2 className="text-lg font-bold">{user?.name || "User Name"}</h2>
          <p className="text-gray-600">{user?.email}</p>
          <p className="text-gray-600">{user?.phone}</p>
          <div className="mt-8 ml-2 flex flex-col items-left ">
            <Link href="/user/account" className="cursor-pointer hover:text-gray-600">
              <button className="px-4 py-2 rounded flex items-center justify-left cursor-pointer">
                <Icon icon="mdi:account" className="mr-2" />
                Detail Akun
              </button>
            </Link>
            <Link href="/user/order-history" className="cursor-pointer hover:text-gray-600">
              <button className="px-4 py-2 rounded flex items-center mt-2 cursor-pointer">
                <Icon icon="mdi:shopping" className="mr-2" />
                Riwayat Order
              </button>
            </Link>
            <Link href="/user/address" className="cursor-pointer hover:text-gray-600">
              <button className="px-4 py-2 rounded mt-2 flex items-center cursor-pointer">
                <Icon icon="mdi:map-marker" className="mr-2" />
                Alamat
              </button>
            </Link>
          </div>
        </div>
        <div className="md:w-2/3 ml-4 flex flex-col justify-center">
          <h3 className="text-xl font-bold mb-4">Selamat datang, {user?.name || "User"}!</h3>
          <p className="text-gray-700">Kelola akun, pesanan, dan alamat Anda dengan mudah melalui menu di samping.</p>
        </div>
      </div>
    </div>
    </>
  );
}