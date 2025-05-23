'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaShoppingCart } from 'react-icons/fa';
import { Poppins } from 'next/font/google';
import Header from '@/app/_components/Header';
import { Footer } from '@/app/_components/Footer';

const poppR = Poppins({ subsets: ['latin'], weight: '400' });
const poppB = Poppins({ subsets: ['latin'], weight: '700' });

function formatPrice(price: number) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export default function ProductClientPage({ product }: { product: any }) {
  const [quantity, setQuantity] = useState<number | ''>(1);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; success: boolean }>({ show: false, message: '', success: true });

  // Increase quantity, but not above stock
  const increaseQuantity = () => {
    setQuantity(q => {
      const next = (q === '' ? 1 : q) + 1;
      return next > product.stock ? product.stock : next;
    });
  };

  // Decrease quantity, but not below 1
  const decreaseQuantity = () => {
    setQuantity(q => {
      const next = (q === '' ? 1 : q) - 1;
      return next < 1 ? 1 : next;
    });
  };

  // Handle manual input
 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const val = e.target.value;
  if (val === '') {
    setQuantity('');
    return;
  }
  let num = parseInt(val, 10);
  if (isNaN(num) || num < 1) num = 1;
  if (num > product.stock) num = product.stock;
  setQuantity(num);
};

  // On blur, reset to 1 if empty
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '' || isNaN(Number(e.target.value))) {
      setQuantity(1);
    }
  };

  const handleAddToCart = async () => {
    setAdding(true);
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id, quantity: quantity === '' ? 1 : quantity }),
    });
    setAdding(false);

    if (res.ok) {
      setToast({ show: true, message: 'Berhasil ditambahkan ke keranjang!', success: true });
    } else {
      const data = await res.json();
      setToast({ show: true, message: data.error || 'Gagal menambah ke keranjang', success: false });
    }
    setTimeout(() => setToast({ ...toast, show: false }), 2000);
  };

  return (
    <>
      <Header />
      <div className="bg-[#F7F4E8] pb-40 px-40 flex flex-col justify-between items-start pt-28">
        <Link href="/" className="mt-4 text-black rounded-2xl hover:underline mb-10">
          &lt; Kembali ke homepage
        </Link>
        <div className="flex justify-between w-full">
          <div className="flex w-full flex-row gap-x-28">
            <div className="flex-shrink-0 bg-white rounded-lg p-4 mr-4 flex items-center">
              <Image
                src={product.gambar}
                alt={product.name}
                width={350}
                height={350}
                className="rounded-lg pt-8"
                priority
              />
            </div>
            <div className="ml-6 flex-grow flex flex-col justify-center">
              <h1
                className="text-[#EDC043] text-5xl font-bold text-left mb-8"
                style={{ fontFamily: 'Milker, sans-serif' }}
              >
                {product.name.toUpperCase()}
              </h1>
              <p className={`${poppR.className} text-md text-gray-600 mb-4`}>
                {product.deskripsi}
              </p>
              <p className={`${poppB.className} text-3xl mb-2 text-[#6B3C10]`}>
                Rp {formatPrice(product.harga)}
                <span className="ml-2 text-base text-gray-500 font-normal">
                  {product.name.toLowerCase().includes('telur') || product.name.toLowerCase().includes('potong') ? '/kg' : '/ekor'}
                </span>
              </p>
              <div className="text-md text-gray-500 mb-6">
                Stok tersedia: <span className="font-bold text-[#EDC043]">{product.stock}</span>
              </div>
              <div className="flex items-center mb-4 gap-4">
                <div className="flex items-center bg-[#EEEBDE] rounded-2xl p-3 w-40 justify-center" >
                  <button
                    onClick={decreaseQuantity}
                    className="text-[#EDC043] font-bold rounded-full w-8 h-8 flex items-center justify-center"
                    aria-label="Kurangi"
                  >-</button>
                  <input
                    type="number"
                    min={1}
                    max={product.stock}
                    value={quantity}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className="mx-2 w-10 text-center text-md text-black font-bold bg-transparent outline-none
                      [&::-webkit-inner-spin-button]:appearance-none
                      [&::-webkit-outer-spin-button]:appearance-none
                      [appearance:textfield]"
                    aria-label="Jumlah"
                  />
                  <button
                    onClick={increaseQuantity}
                    className="text-[#EDC043] font-bold rounded-full w-8 h-8 flex items-center justify-center"
                    aria-label="Tambah"
                    disabled={quantity === '' ? false : quantity >= product.stock}
                  >+</button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="bg-gradient-to-br from-yellow-start to-yellow-end hover:cursor-pointer text-black px-8 py-4 rounded-2xl font-semibold flex items-center"
                  disabled={adding || product.stock === 0}
                >
                  <FaShoppingCart className="mr-2" />
                  {adding ? 'Menambah...' : 'Tambah ke keranjang'}
                </button>
              </div>
            </div>
          </div>
        </div>
        {toast.show && (
          <div
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-lg z-50 transition-all animate-fade-in ${
              toast.success ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
          >
            {toast.message}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}