'use client';
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PageAlamat() {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "Raditya Rahman",
      phone: "+62 812 9597 4452",
      address: "Komplek Pertanian Atsiri Permai, Jalan Sedap Malam IV No.17, RT.1/RW.12, Ragajaya, Bojonggede, BOJONGGEDE, KAB. BOGOR, JAWA BARAT, ID, 16920",
      isPrimary: true,
    },
    {
      id: 2,
      name: "Fitha Anggraini Tahir",
      phone: "+62 857 1466 1812",
      address: "Griya Kyatti, Jalan Haji Bakri No. 36 B, RT.9/RW.4, Pondok Bambu, Duren Sawit, unit 4, DUREN SAWIT, KOTA JAKARTA TIMUR, DKI JAKARTA, ID, 13440",
      isPrimary: false,
    },
  ]);

  const [isDetailActive, setIsDetailActive] = useState(false); // State untuk mengelola status tombol

  useEffect(() => {
    // Mengaktifkan tombol detail akun saat halaman dimuat
    setIsDetailActive(true);
  }, []);

  const addAddress = (newAddress) => {
    setAddresses((prevAddresses) => [
      ...prevAddresses,
      { ...newAddress, id: prevAddresses.length + 1 }, // Menambahkan ID baru
    ]);
  };

  const handleSetPrimary = () => {
    // Fungsi ini tidak berfungsi
  };

  const handleDelete = (id) => {
    setAddresses((prevAddresses) => prevAddresses.filter(address => address.id !== id)); // Menghapus alamat berdasarkan ID
  };

  const handleEdit = (id) => {
    // Mengarahkan ke halaman edit dengan ID yang sesuai
    window.location.href = `/alamat/edit?id=${id}`;
  };

  return (
    <div className='bg-[#F7F4E8] min-h-screen p-10 text-black'>
      <Link href="/user" className="mt-4 text-black hover:underline mb-10">
        &lt; Kembali ke userpage
      </Link>
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Alamat Saya</h1>
        <Link href='/alamat/add'>
          <button
            className="mb-4 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600"
          >
            + Tambah Alamat Baru
          </button>
        </Link>

        {addresses.length === 0 ? (
          <p className="text-gray-500">Anda belum memasukkan alamat.</p>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="p-4 bg-white rounded-md shadow-md border"
              >
                <h2 className="font-semibold text-lg">{address.name}</h2>
                <p className="text-sm text-gray-600">{address.phone}</p>
                <p className="text-sm text-gray-800 mt-1">{address.address}</p>
                <div className="flex items-center mt-4 space-x-2">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => handleEdit(address.id)} // Mengarahkan ke halaman edit
                  >
                    Ubah
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleDelete(address.id)} // Menghapus alamat
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
  );
}
