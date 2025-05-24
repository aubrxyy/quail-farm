"use client";
import Header from "@/app/_components/Header";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageAlamat() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/addresses")
      .then(res => res.json())
      .then(setAddresses);
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus alamat ini?")) return;
    await fetch(`/api/addresses/${id}`, { method: "DELETE" });
    setAddresses(addresses.filter(a => a.id !== id));
  };

  const handleEdit = (id: number) => {
    router.push(`/user/address/${id}`);
  };

  return (
    <>
    <Header />
    <div className='bg-[#F7F4E8] min-h-screen p-10 text-black pt-28 px-40'>
      <Link href="/user" className="mt-4 text-black hover:underline mb-10">
        &lt; Kembali ke userpage
      </Link>
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Alamat Saya</h1>
        <Link href='/user/address/add'>
          <button className="mb-4 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600">
            + Tambah Alamat Baru
          </button>
        </Link>
        {addresses.length === 0 ? (
          <p className="text-gray-500">Anda belum memasukkan alamat.</p>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div key={address.id} className="p-4 bg-white rounded-md shadow-md border">
                <div className="font-semibold text-lg">{address.street}</div>
                <div className="text-sm text-gray-600">{address.city}, {address.province} {address.postalCode}</div>
                <div className="flex items-center mt-4 space-x-2">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => handleEdit(address.id)}
                  >
                    Ubah
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleDelete(address.id)}
                  >
                    Hapus
                  </button>
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
