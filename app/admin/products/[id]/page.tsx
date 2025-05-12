'use client'
import React, { useState } from "react";
import { useParams } from "next/navigation";

export default function EditProductPage() {
  const params = useParams();
  const { id } = params;
  const [name, setName] = useState("Puyuh bakar");
  const [price, setPrice] = useState("Rp. 35.000,00");
  const [description, setDescription] = useState(
    "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisi malesuada."
  );
  const [descError, setDescError] = useState(true);

  return (
    <div className="min-h-screen bg-[#f6f3e7] p-8">
          <h1 className="text-3xl font-semibold mb-6">Edit Product {id}</h1>
      <div className="bg-white rounded-2xl p-8 flex" style={{ minHeight: 500 }}>
        <form className="w-[40%] border-2 border-dashed border-[#cfc2f2] rounded-2xl p-8 flex flex-col gap-6">
          {/* Product Name */}
          <div>
            <label className="block font-medium mb-1">Nama Produk</label>
            <input
              className="w-full border rounded-lg px-4 py-2 mb-1"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Masukkan nama produk"
            />
            <div className="text-xs text-gray-400">Masukkan nama produk</div>
          </div>
          {/* Product Price */}
          <div>
            <label className="block font-medium mb-1">Harga Produk</label>
            <input
              className="w-full border-2 border-[#f6a700] rounded-lg px-4 py-2 font-medium text-lg mb-1"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="Masukkan harga produk"
            />
            <div className="text-xs text-gray-400">Masukkan harga produk</div>
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
                Error message informing me of a problem
              </div>
            )}
          </div>
        </form>
        <div className="flex-1" />
      </div>
      <div className="flex justify-end gap-4 mt-8">
        <button className="bg-[#cfc2f2] text-[#2d2d2d] px-8 py-2 rounded-lg font-medium hover:bg-[#bba6e0] transition">
          Edit
        </button>
        <button className="bg-[#f25c5c] text-white px-8 py-2 rounded-lg font-medium hover:bg-[#e04a4a] transition">
          Cancel
        </button>
      </div>
      {/* Pagination and info */}
      <div className="flex justify-between items-center mt-12">
        <div className="text-gray-500 text-sm">
          Showing 1-09 of 78
        </div>
        <div className="flex gap-2">
          <button className="bg-white rounded-full p-2 border">
            &lt;
          </button>
          <button className="bg-white rounded-full p-2 border">
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}