'use client'

import { Poppins } from 'next/font/google';
import Link from 'next/link';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const poppR = Poppins({
  subsets: ['latin'],
  weight: '400',
});

const poppB = Poppins({
  subsets: ['latin'],
  weight: '700',
});

function formatPrice(price: number) {
  if (price >= 1000) {
    return `${price / 1000}k`;
  }
  return price.toString();
}

export function Hero() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div className="bg-[#E6DCB8] mt-30 min-h-screen w-full flex flex-col items-start justify-center px-4 lg:px-0 relative">
        <h1
          style={{ fontFamily: 'Milker, sans-serif' }}
          className="text-4xl lg:text-4xl text-black leading-tight max-w-xl text-left mt-20 ml-40"
        >
          DARI CIMAHPAR, PUYUH BERKUALITAS UNTUK MEJA MAKAN ANDA
        </h1>

        {/* Crack Egg SVG as full-width background and overlapping */}
        <div className="relative w-full z-10" style={{ minHeight: 400 }}>
          <div className="absolute left-0 top-0 w-screen h-fit -z-10">
            <Image
              src="/crackegg.svg"
              alt="Crack Egg"
              className="w-full h-full object-cover"
              style={{ objectPosition: 'top' }}
              draggable={false}
              width={1000}
              height={1000}
            />
          </div>
          <div className="relative z-20 pt-32 pb-12 px-6 w-full max-w-6xl mx-auto mt-">
            <h2
              style={{ fontFamily: 'Milker, sans-serif' }}
              className="text-4xl lg:text-7xl bg-gradient-to-br from-yellow-start to-yellow-end bg-clip-text text-transparent text-center"
            >
              PRODUK KAMI
            </h2>
            <p className={`${poppR.className} text-md text-[#6B3C10] mt-2 text-center`}>
              Dipilih secara langsung untuk kualitas terbaik
            </p>

            <div className="mt-48 grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
              {products.map((product) => (
                <div key={product.id} className="relative h-fit pt-16 pb-12 flex flex-col items-center bg-[#6B3C10] rounded-4xl shadow-lg p-4 w-[20rem]">
                  <Image
                    src={product.gambar}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="absolute -top-40 mx-auto mb-4 flex items-center size-72"
                  />
                  <div className="pt-24 pb-2 flex flex-col items-center justify-center">
                    <h3 className="text-[#F8F5E9] text-4xl font-bold text-center px-24" style={{ fontFamily: 'Milker, sans-serif' }}>
                      {product.name.toUpperCase()}
                    </h3>
                    <p className={`${poppB.className} text-7xl bg-gradient-to-b from-yellow-start to-yellow-end bg-clip-text text-transparent mt-2 mb-8`}>
                      {formatPrice(product.harga)}
                      <span className={`${poppR.className} inline-block text-sm text-[#EDC043]`}>
                        /kg
                      </span>
                    </p>
                    <button className="w-12 h-12 flex items-center cursor-pointer justify-center rounded-full border-2 border-white text-white hover:bg-white hover:text-[#6B3C10] transition duration-300">
                      <Link href={`/products/${product.slug}`}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}