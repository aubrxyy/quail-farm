"use client";
import { Poppins } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';

const poppR = Poppins({
  subsets: ['latin'],
  weight: '400',
});

const poppB = Poppins({
  subsets: ['latin'],
  weight: '700',
});

export default function Puyuh() {
  const [quantity, setQuantity] = useState(1);
  const pricePerUnit = 30000;

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  return (
    <div className="bg-[#F7F4E8] min-h-screen p-10 flex flex-col items-start">
      <Link href="/" className="mt-4 text-black hover:underline mb-10">
        &lt; Kembali ke homepage
      </Link>
      <div className="flex justify-center w-full">
        <div className="flex max-w-4xl w-full">
          <div className="flex-shrink-0 bg-white rounded-lg p-4 mr-4">
            <Image
              src="/puyuh.png" // Ganti dengan path gambar yang sesuai
              alt="Puyuh"
              width={350}
              height={350}
              className="rounded-lg"
            />
          </div>
          <div className="ml-6 flex-grow">
            <h1 className="text-[#EDC043] text-3xl font-bold text-left mb-8" style={{ fontFamily: 'Milker, sans-serif' }}>BURUNG PUYUH</h1>
            <p className={`${poppR.className} text-sm text-gray-600 mb-4`}>
              Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis.
            </p>
            <p className={`${poppB.className} text-xl mb-20 text-[#6B3C10]`}>
              Rp. {pricePerUnit.toLocaleString()}
            </p>
            <div className="flex items-center mb-4 border border-[#EDC043] rounded-full p-1" style={{ width: '109.6px' }}>
              <button onClick={decreaseQuantity} className="text-[#EDC043] font-bold rounded-full w-8 h-8 flex items-center justify-center">-</button>
              <span className="mx-4 text-sm text-black font-bold">{quantity}</span>
              <button onClick={increaseQuantity} className="text-[#EDC043] font-bold rounded-full w-8 h-8 flex items-center justify-center">+</button>
            </div>
            <button className="bg-[#EDC043] text-black px-6 py-2 rounded-full font-semibold flex items-center">
              <FaShoppingCart className="mr-2" />
              Tambah ke keranjang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
