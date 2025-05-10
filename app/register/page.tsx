'use client'

import { signup } from '@/app/api/auth/auth'
import { useState } from 'react'
import Image from 'next/image'
import { Poppins } from 'next/font/google'

const pop = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

export default function Register() {
  const [errors, setErrors] = useState<any>(null)
  const [pending, setPending] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setPending(true);
  setErrors(null);
  setSuccess(false);

  const password = (e.currentTarget.elements.namedItem("password") as HTMLInputElement).value;
  const confirmPassword = (e.currentTarget.elements.namedItem("konfirmpassword") as HTMLInputElement).value;

  if (password !== confirmPassword) {
    setErrors("Password dan konfirmasi password tidak cocok.");
    setPending(false);
    return;
  }

  const formData = new FormData(e.currentTarget);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      setErrors(result.error || "An unexpected error occurred.");
    } else {
      setSuccess(true);
    }
  } catch (error) {
    console.error("Signup error:", error);
    setErrors("An unexpected error occurred.");
  } finally {
    setPending(false);
  }
};

  return (
    <div className={`${pop.className} bg-cover bg-center min-h-screen flex items-center justify-center`} style={{ backgroundImage: "url('/loginBG.jpeg')" }}>
      <div className="bg-white px-8 py-10 rounded-lg shadow-lg text-center w-full max-w-lg">
        <h2 className={`text-3xl mb-4 text-black font-bold`}>Buat Akun</h2>
          <>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="mb-1 sm:col-span-2">
                <label htmlFor="name" className={`block text-left mb-2 text-gray-700`}>Nama Lengkap</label>
                <input type="text" id="name" name='name' className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#A0522D] text-black" placeholder="Masukkan Nama Lengkap" required />
              </div>
              {/* <div className="mb-1 sm:col-span-2">
                <label htmlFor="phoneNumber" className={`block text-left mb-2 text-gray-700`}>Nomor Telepon</label>
                <input type="text" name='phoneNumber' id="phoneNumber" className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#A0522D] text-black" placeholder="Masukkan phone number" required onInput={handlePhoneNumberInput} pattern="[0-9]*" />
              </div>
              */}
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
              <p className={`text-gray-400 mb-1`}>Sudah punya akun? <a href="/login" className="text-[#EDB943] hover:underline">Masuk</a></p>
                <button type="submit" className="w-full bg-[#EDB943] hover:bg-[#8B4513] text-white p-2 rounded sm:col-span-2">Daftar</button>
            </form>
{errors && <p className="text-red-500 text-sm mt-2">{errors}</p>}
{success && <p className="text-green-500 text-sm mt-2">Registration successful! Redirecting...</p>}
            <hr className="mt-8" />
            <div className="flex justify-center">
              <Image src="/logo.png" width={150} height={100} alt="AR3" className="mt-8" />
            </div>
          </>

      </div>
    </div>
  )
}