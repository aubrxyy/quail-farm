"use client";
import { Poppins } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FaTrash } from 'react-icons/fa';

const poppR = Poppins({
  subsets: ['latin'],
  weight: '400',
});

const poppB = Poppins({
  subsets: ['latin'],
  weight: '700',
});

export default function Cart() {
  const [quantity, setQuantity] = useState(1);
  const pricePerUnit = 40000;
  const [activeButton, setActiveButton] = useState('');

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  return (
    <div className={`bg-[#F7F4E8] min-h-screen p-10 flex flex-col items-start text-black ${poppR.className}`}>
        <Link href="/" className="text-black hover:underline text-left mb-2">
          &lt; Kembali ke homepage
        </Link>
        <div className='container mx-auto py-10 px-4 sm:px-16'>
          <div className="flex max-sm:flex-wrap justify-between gap-2">
            <div className="w-full lg:w-2/3">
              <h1 className={`text-3xl font-bold mb-6 text-[#EDC043] ${poppB.className}`} style={{ fontFamily: 'Milker, sans-serif' }}>KERANJANG SAYA</h1>
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
                  <tr className="border-b dark:border-gray-700 hover:bg-gray-100 transition-colors">
                    <td className="px-4 py-3 flex items-center justify-center">
                      <Image
                        src="/telurpuyuh.png" // Ganti dengan path gambar yang sesuai
                        alt="Telur Puyuh"
                        width={50}
                        height={50}
                        className="rounded-lg mr-4"/>
                      <span>Telur Puyuh</span>
                    </td>
                    <td className="px-4 py-3 text-center">Rp. {pricePerUnit.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={decreaseQuantity} className="text-[#EDC043] px-2 rounded font-bold transition-colors">-</button>
                      <span className="mx-2">{quantity}</span>
                      <button onClick={increaseQuantity} className="text-[#EDC043] px-2 rounded font-bold transition-colors">+</button>
                    </td>
                    <td className="px-4 py-3 justify-end">
                      <div 
                        className="p-2 rounded-full  transition-colors cursor-pointer flex items-center justify-center" 
                        onClick={() => {/* Tambahkan logika untuk menghapus item */}}
                      >
                        <FaTrash className="text-red-600 text-lg" />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="w-full lg:w-1/3 sm:ml-10">
              <div className="flex mb-4 border border-[#CACACA] rounded-lg">
                <div className="flex-1">
                  <div 
                    className={`text-center py-2 rounded-l-lg cursor-pointer ${activeButton === 'pickup' ? 'bg-[#EDC043] text-white' : 'bg-[#EEEBDE] text-[#EDC043] hover:bg-[#EDC043] hover:text-white'}`} 
                    onClick={() => { setActiveButton('pickup'); /* Tambahkan logika untuk Pick up */ }}
                    onMouseDown={() => setActiveButton('pickup')}
                    onMouseUp={() => setActiveButton('')}
                  >
                    <span className="font-bold">Pick up</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div 
                    className={`text-center py-2 rounded-r-lg cursor-pointer ${activeButton === 'delivery' ? 'bg-[#EDC043] text-white' : 'bg-[#EEEBDE] text-[#EDC043] hover:bg-[#EDC043] hover:text-white'}`} 
                    onClick={() => { setActiveButton('delivery'); /* Tambahkan logika untuk Pick up */ }}
                    onMouseDown={() => setActiveButton('delivery')}
                    onMouseUp={() => setActiveButton('')}
                  >
                    <span className="font-bold">Delivery</span>
                  </div>
                </div>
              </div>
              <div className="bg-[#EEEBDE] border border-[#CACACA] rounded-lg p-4">
                <h3 className="font-bold text-lg text-center">RINGKASAN PEMBAYARAN</h3>
                <p className="mt-6">Total: Rp. {(pricePerUnit * quantity).toLocaleString()}</p>
                <p>Biaya pengiriman: Rp. 0</p>
                <p className="font-bold">Total Pembayaran: Rp. {(pricePerUnit * quantity).toLocaleString()}</p>
                <button className="bg-[#6B3C10] px-4 py-2 rounded-lg mt-8 text-white w-full font-bold ">CHECKOUT</button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
