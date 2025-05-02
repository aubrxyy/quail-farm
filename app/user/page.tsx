// app/profile/page.tsx
'use client';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useState } from 'react';

export default function Profile() {
  const [fullName, setFirstName] = useState('Tony Boss');
  const [email, setEmail] = useState('hi.avitex@gmail.com');
  const [phone, setPhone] = useState('(12) 345 678 910');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleUpdateAccount = () => {
    // Logika untuk memperbarui akun
    if (newPassword !== confirmPassword) {
        setErrorMessage('Password baru dan konfirmasi password tidak cocok.');
        return;
    }
    setErrorMessage(''); // Reset pesan kesalahan jika validasi berhasil
    console.log('Account updated:', { fullName, email, phone });
  };

  return (
    <div className='bg-[#F7F4E8] min-h-screen p-10 text-black'>
      <div className="flex flex-col md:flex-row p-6 ml-8">
        <div className="flex flex-col items-center md:w-1/3 mb-6 bg-[#E6DCB8] mr-8 rounded rounded-3xl">
          <div className="w-24 h-24 rounded-full bg-gray-300 mb-4 mt-10"></div>
          <h2 className="text-lg font-bold">{`${fullName}`}</h2>
          <p className="text-gray-600">{email}</p>
          <p className="text-gray-600">{phone}</p>

          <div className="mt-8 ml-2 flex flex-col items-left ">
            <button className=" px-4 py-2 rounded flex items-center justify-left">
              <Icon icon="mdi:account" className="mr-2" />
              Detail Akun
            </button>
            <Link href="/user/history-order">
              <button className="px-4 py-2 rounded flex items-center mt-2">
                <Icon icon="mdi:shopping" className="mr-2" />
                Riwayat Order
              </button>
            </Link>
            <Link href="/alamat">
              <button className="px-4 py-2 rounded mt-2 flex items-center">
                <Icon icon="mdi:map-marker" className="mr-2" />
                Alamat
              </button>
            </Link>
          </div>
        </div>
        <div className="md:w-2/3 ml-4">
          <h3 className="text-xl font-bold mb-4">Informasi Akun</h3>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdateAccount(); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Nama Lengkap</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Nomor Telepon</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
          </form>
          <h3 className="text-xl font-bold mb-4 mt-6">Ubah Password</h3>
          <form onSubmit={(e) => { e.preventDefault(); handleUpdateAccount(); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Password Baru</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Konfirmasi Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`mt-1 block w-full border ${errorMessage ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 transition duration-300 ease-in-out`}
                
              />
              {errorMessage && <p className="text-red-500 text-sm mt-1 animate-pulse">{errorMessage}</p>}
            </div>
            <button type="submit" className="bg-[#6B3C10] text-white px-4 py-2 rounded mt-4">
              Perbarui Akun
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}