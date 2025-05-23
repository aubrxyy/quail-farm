'use client'
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState('');
  const [gambar, setGambar] = useState('');
  const [descError, setDescError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch product data
  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(product => {
        setName(product.name || '');
        setPrice(product.harga?.toString() || '');
        setDescription(product.deskripsi || '');
        setGambar(product.gambar || '');
        setStock(product.stock?.toString() || '');
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // Validate description
  useEffect(() => {
    setDescError(description.trim().length < 10);
  }, [description]);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (descError) return;
    await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        harga: Number(price),
        deskripsi: description,
        stock: Number(stock),
        gambar,
      }),
    });
    router.push('/admin/products');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f3e7]">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f3e7] p-8 mt-16">
      <h1 className="text-3xl font-semibold mb-6">
        Edit <span className="text-yellow-600">{name || `Product ${id}`}</span>
      </h1>
      <div className="bg-white rounded-2xl p-8 flex" style={{ minHeight: 500 }}>
        <form
          className="w-[40%] border-2 border-dashed border-[#cfc2f2] rounded-2xl p-8 flex flex-col gap-6"
          onSubmit={handleEdit}
        >

          {/* Product Name */}
          <div>
            <label className="block font-medium mb-1">Nama Produk</label>
            <input
              className="w-full border rounded-lg px-4 py-2 mb-1"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Masukkan nama produk"
              required
            />
            <div className="text-xs text-gray-400">Masukkan nama produk</div>
          </div>
          {/* Product Price */}
          <div>
            <label className="block font-medium mb-1">Harga Produk (kg)</label>
            <input
              type="number"
              className="w-full border-2 border-[#f6a700] rounded-lg px-4 py-2 font-medium text-lg mb-1"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="Masukkan harga produk"
              required
              min={0}
            />
            <div className="text-xs text-gray-400">Masukkan harga produk dalam hitungan (/kg)</div>
          </div>
          {/* Stock */}
          <div>
            <label className="block font-medium mb-1">Stok Produk</label>
            <input
              type="number"
              className="w-full border rounded-lg px-4 py-2 mb-1"
              value={stock}
              onChange={e => setStock(e.target.value)}
              placeholder="Masukkan stok produk"
              required
              min={0}
            />
            <div className="text-xs text-gray-400">Masukkan stok produk</div>
          </div>
          
          {/* Description */}
          <div>
            <label className="block font-medium mb-1">Deskripsi</label>
            <div className="relative">
              <textarea
                className={`w-full border-2 rounded-lg px-4 py-2 mb-1 ${
                  descError
                    ? "border-[#f25c5c] bg-[#fff6f6]"
                    : "border-gray-300"
                }`}
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={5}
                placeholder="Masukkan deskripsi produk"
                required
              />
              {descError && (
                <span className="absolute top-2 right-2 text-[#f25c5c]">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="#f25c5c" />
                    <text x="12" y="16" textAnchor="middle" fontSize="16" fill="white" fontWeight="bold">!</text>
                  </svg>
                </span>
              )}
            </div>
            {descError && (
              <div className="text-xs text-[#f25c5c] mt-1">
                Deskripsi minimal 10 karakter
              </div>
            )}
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="submit"
              disabled={descError}
              className="bg-yellow-400 text-[#2d2d2d] px-8 py-2 rounded-lg font-medium hover:bg-yellow-300 hover:cursor-pointer transition disabled:opacity-50"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/products')}
              className="bg-[#f25c5c] text-white px-8 py-2 rounded-lg font-medium hover:bg-[#e04a4a] transition"
            >
              Cancel
            </button>
          </div>
        </form>
        <div className="flex-1 flex flex-col items-center justify-center">
          {gambar && (
            <Image src={gambar} alt={name} width={100} height={100} className="size-96 object-contain mb-4 rounded-xl shadow" />
          )}
        </div>
      </div>
    </div>
  );
}