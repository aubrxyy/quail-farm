"use client";
import Header from "@/app/_components/Header";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AccountDetail() {
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/validate")
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
        setFullName(data.user?.name || "");
        setEmail(data.user?.email || "");
        setPhone(data.user?.phone || "");
      });
  }, []);

  const handleUpdateAccount = async () => {
    setErrorMessage("");
    setSuccess(false);

    const res = await fetch(`/api/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fullName,
        email,
        phone,
      }),
    });
    if (!res.ok) {
      setErrorMessage("Gagal memperbarui akun.");
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/user");
      }, 1500); // Show toast for 1.5s before redirect
    }
  };

  return (
    <>
      <Header />
      <div className='bg-[#F7F4E8] min-h-screen p-10 text-black pt-24'>
        <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Informasi Akun</h3>
          {errorMessage && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-2">{errorMessage}</div>
          )}
          {success && (
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-2">
              Akun berhasil diperbarui!
            </div>
          )}
          <form onSubmit={e => { e.preventDefault(); handleUpdateAccount(); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Nama Lengkap</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Nomor Telepon</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <button type="submit" className="bg-[#6B3C10] text-white px-4 py-2 rounded mt-4 cursor-pointer">
              Perbarui Akun
            </button>
          </form>
        </div>
      </div>
    </>
  );
}