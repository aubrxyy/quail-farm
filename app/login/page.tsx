'use client';

import { Poppins } from 'next/font/google';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const poppB = Poppins({
  subsets: ['latin'],
  weight: '700',
});

const poppR = Poppins({
  subsets: ['latin'],
  weight: '400',
});

export default function Login() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Data dummy
    const dummyUsername = 'user';
    const dummyPassword = 'user123';

    if (username === dummyUsername && password === dummyPassword) {
      setSuccessMessage('Login berhasil!');
      setErrorMessage(null);
      // Simpan data pengguna di localStorage
      localStorage.setItem('user', JSON.stringify({ username }));
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } else {
      setErrorMessage('Username atau password salah.');
      setSuccessMessage(null);
    }
  };

  return (
    <div className="bg-cover bg-center h-screen" style={{ backgroundImage: "url('/loginBG.jpeg')" }}>
      <div className="flex items-center justify-center h-full px-4">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-black mb-12 text-center">Masuk</h1>
          {successMessage && (
            <div className="mb-4 text-sm text-green-500 bg-green-200 border-2 border-green-400 rounded-md p-3">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="mb-4 text-sm text-red-500 bg-red-200 border-2 border-red-400 rounded-md p-3">
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#A0522D] text-black"
                placeholder="Masukkan username"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#A0522D] text-black"
                placeholder="Masukkan password"
                required
              />
            </div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2"
              />
              <label className="text-sm text-gray-700">Ingat saya</label>
            </div>
            <p className="mt-4 mb-4 text-left text-sm text-gray-400">
              Belum punya akun?{' '}
              <a href="/register" className="text-[#EDB943] hover:underline">
                Daftar di sini
              </a>
            </p>
            <button
              type="submit"
              className="w-full bg-[#EDB943] text-white font-bold py-2 rounded-md hover:bg-[#8B4513] transition duration-200">
              Masuk
            </button>
            <hr className="mt-2" />
            <div className="flex justify-center">
              <Image src="/logo.png" width={150} height={100} alt="AR3" className="mt-20" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
