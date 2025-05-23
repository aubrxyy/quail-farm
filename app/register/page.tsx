'use client';

import { Inter } from 'next/font/google';
import Image from "next/image";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const inter = Inter({
  subsets: ['latin'],
  weight: '700',
});

const interR = Inter({
  subsets: ['latin'],
  weight: '400',
});

export default function Register() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fullName = (document.getElementById('fullName') as HTMLInputElement).value;
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const phoneNumber = (document.getElementById('phoneNumber') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const confirmPassword = (document.getElementById('konfirmpassword') as HTMLInputElement).value;

    if (password !== confirmPassword) {
      setErrorMessage('Password dan konfirmasi password tidak cocok.');
      return;
    }

    // Simulasi registrasi sukses
    setSuccessMessage('Registrasi berhasil! Mengarahkan ke halaman login...');
    setErrorMessage(null);

    setTimeout(() => {
      router.push('/login');
    }, 1000); // Tunggu sebentar sebelum navigasi
  };

  const handlePhoneNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const validValue = value.replace(/[^0-9]/g, '');
    e.target.value = validValue;
  };

  return (
    <div className="bg-cover bg-center min-h-screen flex items-center justify-center" style={{ backgroundImage: "url('/loginBG.jpeg')" }}>
      <div className="bg-white px-8 py-10 rounded-lg shadow-lg text-center w-full max-w-lg">
        <h2 className={`text-2xl mb-4 text-black`}>Buat Akun</h2>
          <>
            <form id="registerForm" onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="mb-1 sm:col-span-2">
                <label htmlFor="name" className={`block text-left mb-2 text-gray-700`}>Nama Lengkap</label>
                <input type="text" id="name" name='name' className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#A0522D] text-black" placeholder="Masukkan Nama Lengkap" required />
              </div>
              <div className="mb-1 sm:col-span-2">
                <label htmlFor="phoneNumber" className={`block text-left mb-2 text-gray-700`}>Nomor Telepon</label>
                <input type="text" name='phoneNumber' id="phoneNumber" className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#A0522D] text-black" placeholder="Masukkan phone number" required onInput={handlePhoneNumberInput} pattern="[0-9]*" />
              </div>
              <div className="mb-1 sm:col-span-2">
                <label htmlFor="email" className={`block text-left mb-2 text-gray-700`}>Email</label>
                <input type="email" name='email' id="email" className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#A0522D] text-black" placeholder="Masukkan email" required />
              </div>
              <div className="mb-1 sm:col-span-2">
                <label htmlFor="password" className={`block text-left mb-2 text-gray-700`}>Password</label>
                <input type="password" name='password' id="password" className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#A0522D] text-black" placeholder="Masukkan password" required />
              </div>
              <div className="mb-1 sm:col-span-2">
                <label htmlFor="konfirmpassword" className={`block text-left mb-2 text-gray-700`}>Konfirmasi Password</label>
                <input type="password" id="konfirmpassword" className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#A0522D] text-black" placeholder="Konfirmasi password" required />
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className="w-full bg-[#EDB943] hover:bg-[#8B4513] text-white p-2 rounded">Daftar</button>
              </div>
            </form>

            <p className={`text-gray-400 mb-8 mt-8`}>Sudah punya akun? <a href="/login" className="text-[#EDB943] hover:underline">Masuk</a></p>

            <hr className="mt-8" />
            <div className="flex justify-center">
              <Image src="/logo.png" width={150} height={100} alt="AR3" className="mt-8" />
            </div>
          </>

      </div>
    </div>
  );
}
