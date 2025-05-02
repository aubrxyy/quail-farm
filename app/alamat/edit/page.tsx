'use client';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditAlamat() {
  const router = useRouter();
  const { id } = router.query; // Ambil ID dari query parameter
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    // Simulasi pengambilan data alamat berdasarkan ID
    if (id) {
      // Gantilah ini dengan logika pengambilan data yang sesuai
      const fetchedAddress = {
        name: "Raditya Rahman",
        phone: "+62 812 9597 4452",
        address: "Komplek Pertanian Atsiri Permai, Jalan Sedap Malam IV No.17, RT.1/RW.12, Ragajaya, Bojonggede, BOJONGGEDE, KAB. BOGOR, JAWA BARAT, ID, 16920",
      };
      setAddress(fetchedAddress);
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simpan perubahan alamat (Anda bisa menambahkan logika penyimpanan di sini)
    console.log(address);
    // Redirect ke halaman alamat setelah menyimpan
    router.push('/alamat');
  };

  return (
    <div className='bg-[#F7F4E8] min-h-screen p-10 text-black'>
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Edit Alamat</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Nama</label>
            <input
              type="text"
              value={address.name}
              onChange={(e) => setAddress({ ...address, name: e.target.value })}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Nomor Telepon</label>
            <input
              type="text"
              value={address.phone}
              onChange={(e) => setAddress({ ...address, phone: e.target.value })}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium">Alamat</label>
            <textarea
              value={address.address}
              onChange={(e) => setAddress({ ...address, address: e.target.value })}
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
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
