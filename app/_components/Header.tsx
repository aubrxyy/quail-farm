'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed w-full top-0 h-24 grid grid-cols-3 items-center justify-center px-40 transition-colors duration-300 ${
        isScrolled ? 'bg-white' : 'bg-transparent'
      }`}
    >
      <div className="flex items-center">
        <img src="/list.svg" alt="Menu" className="size-9" />
      </div>

      <div className="flex items-center justify-center">
        <img src="/logo.png" alt="Logo" className="w-36" />
      </div>

      <div className="flex items-center text-brown justify-end">
        <Link
          href="/login"
          className="border-2 border-yellow-end px-6 py-2 rounded-3xl transition-all hover:bg-gradient-to-b font-medium text-sm"
        >
          Masuk
        </Link>
        <Link
          href="/register"
          className="ml-4 bg-gradient-to-br from-yellow-start to-yellow-end px-6 py-2 rounded-3xl hover:bg-gradient-to-b font-bold text-sm"
        >
          Daftar
        </Link>
      </div>
    </header>
  );
}