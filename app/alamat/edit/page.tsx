'use client';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditAlamat() {
  const router = useRouter();
  const [address, setAddress] = useState(null); // State untuk menyimpan alamat yang akan diedit
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressText, setAddressText] = useState("");

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const id = query.get('id');

    // Ambil data alamat berdasarkan ID (dummy data)
    const fetchedAddress = {
      id: id,
      name: "Contoh Nama",
      phone: "+62 812 3456 7890",
      address: "Contoh Alamat",
    };

    setAddress(fetchedAddress);
    setName(fetchedAddress.name);
    setPhone(fetchedAddress.phone);
    setAddressText(fetchedAddress.address);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simpan perubahan alamat
    console.log({ name, phone, addressText });
    router.push('/alamat'); // Redirect ke halaman alamat setelah menyimpan
  };

  if (!address) return <p>Loading...</p>; // Tampilkan loading jika data belum ada

  return (
    <div className='bg-[#F7F4E8] min-h-screen p-10 text-black'>
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-8">Edit Alamat</h1>
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
              value={addressText}
              onChange={(e) => setAddressText(e.target.value)}
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
