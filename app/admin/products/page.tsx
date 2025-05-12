'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const products = [
  {
    id: 1,
    name: 'Burung Puyuh',
    price: 120,
    image: '/uploads/puyuhhead.png',
  },
  {
    id: 2,
    name: 'Telur Puyuh',
    price: 60,
    image: '/uploads/puyuhegg.png',
  },
  {
    id: 3,
    name: 'Puyuh Potong',
    price: 24.59,
    image: '/uploads/puyuhpotong.png',
  },
  // ...add more products as needed
];

const PRODUCTS_PER_PAGE = 9;

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const router = useRouter(); // Use Next.js router for navigation

  const totalProducts = 3; // Example total
  const start = (page - 1) * PRODUCTS_PER_PAGE + 1;
  const end = Math.min(page * PRODUCTS_PER_PAGE, totalProducts);

  return (
    <div className="min-h-screen bg-[#f6f3e7] p-8">
      <h1 className="text-3xl font-semibold mb-6">Products</h1>
      <div className="flex gap-6 flex-wrap">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow p-6 flex flex-col items-center w-80 relative"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-40 h-40 object-contain mb-4"
            />
            <div className="w-full mt-4">
              <div className="font-semibold">{product.name}</div>
              <div className="text-[#f6a700] font-medium mb-4">
                ${product.price.toFixed(2)}
              </div>
              <button
                onClick={() => router.push(`/products/${product.id}`)} // Navigate to the product page
                className="bg-[#f3f6fb] px-4 py-2 rounded-lg text-gray-700 font-medium"
              >
                Edit Product
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination and info */}
      <div className="flex justify-between items-center mt-12">
        <div className="text-gray-500 text-sm">
          Showing {start}-{end} of {totalProducts}
        </div>
        <div className="flex gap-2">
          <button
            className="bg-white rounded-full p-2 border"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            &lt;
          </button>
          <button
            className="bg-white rounded-full p-2 border"
            disabled={end === totalProducts}
            onClick={() => setPage((p) => p + 1)}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}