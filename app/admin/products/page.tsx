'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const PRODUCTS_PER_PAGE = 9;

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [page] = useState(1);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  const totalProducts = products.length;
  const start = (page - 1) * PRODUCTS_PER_PAGE;
  const end = Math.min(page * PRODUCTS_PER_PAGE, totalProducts);
  const paginatedProducts = products.slice(start, end);

  return (
    <div className="min-h-screen bg-[#f6f3e7] p-8">
      <h1 className="text-3xl font-semibold mb-6">Products</h1>
      <div className="flex gap-6 flex-wrap">
        {paginatedProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl shadow p-6 flex flex-col items-center w-80 relative"
          >
            <Image width={160} height={160}
              src={product.gambar}
              alt={product.name}
              className="w-40 h-40 object-contain mb-4"
            />
            <div className="w-full mt-4">
              <div className="font-semibold">{product.name}</div>
              <div className="text-[#f6a700] font-medium mb-1">
                Rp {product.harga.toLocaleString('id-ID')} / kg
              </div>
              <div className="text-gray-500 text-sm mb-2">
                Stock: {product.stock}
              </div>
              <button
                onClick={() => router.push(`/admin/products/${product.id}`)}
                className="bg-[#f3f6fb] px-4 py-2 rounded-lg text-gray-700 font-medium hover:bg-gray-200 hover:cursor-pointer"
              >
                Edit Product
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}