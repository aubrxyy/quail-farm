'use client';
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddAlamat() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simpan alamat baru (Anda bisa menambahkan logika penyimpanan di sini)
    console.log({ name, phone, address });
    // Redirect ke halaman alamat setelah menambah
    router.push('/alamat');
  };

  return (
    <div className='bg-[#F7F4E8] min-h-screen p-10 text-black'>
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-8">Tambah Alamat Baru</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Nama</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Nomor Telepon</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Alamat</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => router.push('/alamat')}
              className="mr-2 bg-gray-300 px-4 py-2 rounded"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-[#6B3C10] text-white px-4 py-2 rounded"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
