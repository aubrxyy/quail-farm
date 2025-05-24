"use client";
import { Poppins } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';

const poppR = Poppins({ subsets: ['latin'], weight: '400' });
const poppB = Poppins({ subsets: ['latin'], weight: '700' });

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeButton, setActiveButton] = useState<'pickup' | 'delivery' | ''>('');
  const [error, setError] = useState<string | null>(null);
  
  // Fetch cart from API
  useEffect(() => {
    fetch('/api/cart')
      .then(res => res.json())
      .then(data => setCart(data))
      .finally(() => setLoading(false));
  }, []);

  // Update quantity
  const updateQuantity = async (cartId: number, newQty: number, maxStock: number) => {
    if (newQty < 1 || newQty > maxStock) return;
    setError(null);
    const res = await fetch(`/api/cart/${cartId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: newQty }),
    });
    const result = await res.json();
    if (res.ok) {
      setCart(cart.map(item => item.id === cartId ? { ...item, quantity: result.quantity } : item));
    } else {
      setError(result.error || "Failed to update quantity");
    }
  };

  // Remove item from cart
  const handleRemoveFromCart = async (itemId: number) => {
    await fetch(`/api/cart/${itemId}`, { method: 'DELETE' });
    setCart(cart.filter(item => item.id !== itemId));
  };

  // Calculate total
  const totalAmount = cart.reduce(
    (total, item) => total + ((item.product?.harga ?? 0) * (item.quantity ?? 0)),
    0
  );

  return (
    <div className={`bg-[#F7F4E8] min-h-screen p-10 flex flex-col items-start text-black ${poppR.className}`}>
      <Link href="/" className="text-black hover:underline text-left mb-2">
        &lt; Kembali ke homepage
      </Link>
      <div className='container mx-auto py-10 px-4 sm:px-16'>
        <div className="flex max-sm:flex-wrap justify-between gap-2">
          <div className="w-full lg:w-2/3">
            <h1 className={`text-3xl font-bold mb-6 text-[#EDC043] ${poppB.className}`} style={{ fontFamily: 'Milker, sans-serif' }}>KERANJANG SAYA</h1>
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <table className="min-w-full border border-gray-300 rounded-md">
              <thead>
                <tr className="bg-[#EDC043] text-white">
                  <th className="py-2">Nama</th>
                  <th className="py-2">Harga</th>
                  <th className="py-2">Jumlah</th>
                  <th className="py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
  {loading ? (
    <tr>
      <td colSpan={4} className="text-center py-4">Loading...</td>
    </tr>
  ) : cart.length === 0 ? (
    <tr>
      <td colSpan={4} className="text-center py-4">Keranjang Kosong</td>
    </tr>
  ) : (
    cart.map((item, index) => (
      <tr key={item.id} className="border-b dark:border-gray-700 hover:bg-gray-100 transition-colors">
        <td className="px-4 py-3 flex items-center justify-center">
          <Image
            src={item.product?.gambar || "/telurpuyuh.png"}
            alt={item.product?.name || "Produk"}
            width={50}
            height={50}
            className="rounded-lg mr-4"
          />
          <span>{item.product?.name}</span>
        </td>
        <td className="px-4 py-3 text-center">
          Rp. {(item.product?.harga ?? 0).toLocaleString()}
        </td>
        <td className="px-4 py-3 text-center">
          <div className="flex items-center justify-center gap-2">
            <button
              className="bg-[#EDC043] text-white p-1 rounded-full font-bold text-md cursor-pointer"
              onClick={() => updateQuantity(item.id, item.quantity - 1, item.product?.stock ?? 0)}
              disabled={item.quantity <= 1}
            >-</button>
            <span className="mx-2">{item.quantity}</span>
            <button
              className="bg-[#EDC043] text-white p-1 rounded-full font-bold text-md cursor-pointer"
              onClick={() => updateQuantity(item.id, item.quantity + 1, item.product?.stock ?? 0)}
              disabled={item.quantity >= item.product?.stock}
            >+</button>
          </div>
        </td>
        <td className="px-4 py-3 justify-end">
          <div
            className="p-2 rounded-full transition-colors cursor-pointer flex items-center justify-center"
            onClick={() => handleRemoveFromCart(item.id)}
          >
            <FaTrash className="text-red-600 text-lg" />
          </div>
        </td>
      </tr>
    ))
  )}
</tbody>
            </table>
          </div>
          <div className="w-full lg:w-1/3 sm:ml-10">
            <div className="flex mb-4 border border-[#CACACA] rounded-lg">
              <div className="flex-1">
                <div 
                  className={`text-center py-2 rounded-l-lg cursor-pointer ${activeButton === 'pickup' ? 'bg-[#EDC043] text-white' : 'bg-[#EEEBDE] text-[#EDC043] hover:bg-[#EDC043] hover:text-white'}`} 
                  onClick={() => setActiveButton('pickup')}
                >
                  <span className="font-bold">Pick up</span>
                </div>
              </div>
              <div className="flex-1">
                <div 
                  className={`text-center py-2 rounded-r-lg cursor-pointer ${activeButton === 'delivery' ? 'bg-[#EDC043] text-white' : 'bg-[#EEEBDE] text-[#EDC043] hover:bg-[#EDC043] hover:text-white'}`} 
                  onClick={() => setActiveButton('delivery')}
                >
                  <span className="font-bold">Delivery</span>
                </div>
              </div>
            </div>
            <div className="bg-[#EEEBDE] border border-[#CACACA] rounded-lg p-4">
              <h3 className="font-bold text-lg text-center">RINGKASAN PEMBAYARAN</h3>
              <p className="mt-6">Total: Rp. {totalAmount.toLocaleString()}</p>
              <p>Biaya pengiriman: Rp. 0</p>
              <p className="font-bold">Total Pembayaran: Rp. {totalAmount.toLocaleString()}</p>
              <button className="bg-[#6B3C10] px-4 py-2 rounded-lg mt-8 text-white w-full font-bold ">CHECKOUT</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}