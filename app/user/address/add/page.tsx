"use client";
import Header from "@/app/_components/Header";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the map component with no SSR
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-64 mb-6 bg-gray-200 rounded flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  )
});

export default function AddAlamat() {
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    if (latitude === null || longitude === null) {
      setError("Silakan pilih lokasi di peta.");
      return;
    }
    const res = await fetch("/api/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ street, city, province, postalCode, latitude, longitude }),
    });
    if (res.ok) {
      router.push("/user/address");
    } else {
      const result = await res.json();
      setError(result.error || "Gagal menambah alamat.");
    }
  };

  return (
    <>
      <Header />
      <div className='bg-[#F7F4E8] min-h-screen pt-28 px-40 text-black'>
        <Link href="/user" className="mt-4 text-black hover:underline mb-10">
          &lt; Kembali ke userpage
        </Link>
        <div className="max-w-3xl mt-12 mx-auto p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-8">Tambah Alamat Baru</h1>
          
          <MapComponent
            latitude={latitude}
            longitude={longitude}
            setLatitude={setLatitude}
            setLongitude={setLongitude}
          />

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium">Jalan/Street</label>
              <input
                type="text"
                value={street}
                onChange={e => setStreet(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Kota/City</label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Provinsi/Province</label>
              <input
                type="text"
                value={province}
                onChange={e => setProvince(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Kode Pos/Postal Code</label>
              <input
                type="text"
                value={postalCode}
                onChange={e => setPostalCode(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            {error && <div className="text-red-500 mb-2">{error}</div>}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => router.push('/user/address')}
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
    </>
  );
}