'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import Image from 'next/image';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [session, setSession] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Validate session via API
    fetch('/api/auth/validate')
      .then(res => res.json())
      .then(data => {
        if (data.valid) {
          setSession(data.session || { user: true });
        } else {
          setSession(null);
        }
      })
      .catch(() => setSession(null));

    setCart(JSON.parse(window.localStorage.getItem('cart') || '[]'));
  }, []);


  return (
       <header
      className={`fixed w-full top-0 h-24 flex items-center justify-between px-40 transition-colors duration-300 z-100 ${
        isScrolled ? 'bg-white' : 'bg-transparent'
      }`}
    >
      <Link href="/" className="flex items-center">
        <Image width={100} height={100} src="/logo.png" alt="Logo" className="w-36" />
      </Link>
    
      <div className="flex items-center text-brown ">
        {session ? (
          <div className="flex items-center gap-x-4">
            <Link href="/cart" className="flex items-center justify-center w-8 h-8 relative">
              <Icon icon="mdi:cart" className="text-[#6B3C10] transition duration-200" width={30} height={30} />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                  {cart.length}
                </span>
              )}
            </Link>
            <Link href="/user" className="flex items-center justify-center w-8 h-8 ml-4">
              <Icon icon="mdi:account" className="text-[#6B3C10] transition duration-200" width={30} height={30} />
            </Link>
                        <button
              onClick={async () => {
                window.location.href = '/logout';
              }}
              className="flex items-center justify-center w-8 h-8 ml-4 hover:cursor-pointer"
            >
              <Icon icon="mdi:logout" className="text-[#6B3C10] transition duration-200" width={30} height={30} />
            </button>
          </div>
        ) : (
          <>
            <Link
              href="/login"
              className="border-2 border-yellow-end px-6 py-2 rounded-3xl transition-all bg-transparent hover:bg-gradient-to-b from-yellow-start to-yellow-end font-medium text-sm"
            >
              <span>Masuk</span>
            </Link>
            <Link
              href="/register"
              className="ml-4 bg-gradient-to-br from-yellow-start to-yellow-end px-6 py-2 rounded-3xl hover:bg-gradient-to-b font-bold text-sm"
            >
              Daftar
            </Link>
          </>
        )}
      </div>
    </header>
  );
}