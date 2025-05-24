"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditAddressPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetch(`/api/addresses/${id}`)
        .then(res => res.json())
        .then(address => {
          setStreet(address.street || "");
          setCity(address.city || "");
          setProvince(address.province || "");
          setPostalCode(address.postalCode || "");
        });
    }
  }, [id]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    const res = await fetch(`/api/addresses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ street, city, province, postalCode }),
    });
    if (res.ok) {
      router.push("/user/address");
    } else {
      const result = await res.json();
      setError(result.error || "Gagal mengubah alamat.");
    }
  };

  if (!id) return <p>Invalid address ID.</p>;

  return (
    <div className='bg-[#F7F4E8] min-h-screen p-10 text-black'>
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-8">Edit Alamat</h1>
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
  );
}
