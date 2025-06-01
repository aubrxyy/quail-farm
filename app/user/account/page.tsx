"use client";
import Header from "@/app/_components/Header";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
  updatedAt: string;
}

// Toast Component
const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-24 right-6 z-50 animate-slide-in-right">
      <div className={`flex items-center p-4 rounded-lg shadow-lg border ${
        type === 'success' 
          ? 'bg-green-50 border-green-200 text-green-800' 
          : 'bg-red-50 border-red-200 text-red-800'
      }`}>
        <div className="flex items-center">
          {type === 'success' ? (
            <Icon icon="solar:check-circle-bold" className="w-5 h-5 mr-3" />
          ) : (
            <Icon icon="solar:danger-circle-bold" className="w-5 h-5 mr-3" />
          )}
          <span className="font-medium">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Icon icon="solar:close-circle-bold" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default function AccountDetail() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // Profile fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  
  // State management
  const [activeTab, setActiveTab] = useState("profile");
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/validate")
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
        setFullName(data.user?.name || "");
        setEmail(data.user?.email || "");
        setPhone(data.user?.phone || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email,
          phone,
        }),
      });

      if (res.ok) {
        setToast({ message: "Profil berhasil diperbarui!", type: "success" });
        // Update user state
        setUser((prev: User) => ({ ...prev!, name: fullName, email, phone }));
      } else {
        const error = await res.json();
        setToast({ message: error.error || "Gagal memperbarui profil.", type: "error" });
      }
    } catch (error) {
      setToast({ message: "Terjadi kesalahan. Silakan coba lagi.", type: "error" });
    }

    setUpdating(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setToast({ message: "Password baru dan konfirmasi password tidak cocok.", type: "error" });
      return;
    }

    if (newPassword.length < 6) {
      setToast({ message: "Password baru minimal 6 karakter.", type: "error" });
      return;
    }

    setUpdating(true);

    try {
      const res = await fetch(`/api/users/${user.id}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (res.ok) {
        setToast({ message: "Password berhasil diperbarui!", type: "success" });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const error = await res.json();
        setToast({ message: error.error || "Gagal memperbarui password.", type: "error" });
      }
    } catch (error) {
      setToast({ message: "Terjadi kesalahan. Silakan coba lagi.", type: "error" });
    }

    setUpdating(false);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className='bg-[#F7F4E8] min-h-screen pt-28'>
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 animate-pulse">
              <div className="space-y-6">
                <div className="h-8 bg-[#E6DCB8] rounded w-1/4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i}>
                      <div className="h-4 bg-[#E6DCB8] rounded w-1/3 mb-2"></div>
                      <div className="h-10 bg-[#E6DCB8] rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className='bg-[#F7F4E8] min-h-screen pt-28'>
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link 
              href="/user" 
              className="inline-flex items-center text-[#6B3C10] hover:text-[#ED9C40] transition-colors duration-200 font-medium"
            >
              <Icon icon="solar:arrow-left-bold" className="w-4 h-4 mr-2" />
              Kembali ke Dashboard
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#6B3C10] mb-2">Pengaturan Akun</h1>
            <p className="text-gray-600">Kelola informasi profil dan keamanan akun Anda</p>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#E6DCB8]">
            <div className="border-b border-[#E6DCB8]">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex-1 px-6 py-4 text-center font-medium transition-colors duration-200 ${
                    activeTab === "profile"
                      ? "bg-gradient-to-r from-[#EDC043] to-[#ED9C40] text-white"
                      : "text-[#6B3C10] hover:bg-[#F7F4E8]"
                  }`}
                >
                  <Icon icon="solar:user-bold" className="w-5 h-5 mr-2 inline" />
                  Informasi Profil
                </button>
                <button
                  onClick={() => setActiveTab("password")}
                  className={`flex-1 px-6 py-4 text-center font-medium transition-colors duration-200 ${
                    activeTab === "password"
                      ? "bg-gradient-to-r from-[#EDC043] to-[#ED9C40] text-white"
                      : "text-[#6B3C10] hover:bg-[#F7F4E8]"
                  }`}
                >
                  <Icon icon="solar:lock-password-bold" className="w-5 h-5 mr-2 inline" />
                  Ubah Password
                </button>
              </nav>
            </div>

            <div className="p-8">
              {activeTab === "profile" && (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#6B3C10] mb-2">
                        Nama Lengkap *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={fullName}
                          onChange={e => setFullName(e.target.value)}
                          className="w-full px-4 py-3 pl-12 border-2 border-[#E6DCB8] rounded-lg focus:ring-2 focus:ring-[#EDC043] focus:border-[#EDC043] transition-all duration-200 text-[#6B3C10] font-medium"
                          placeholder="Masukkan nama lengkap"
                          required
                        />
                        <Icon icon="solar:user-bold" className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#6B3C10] mb-2">
                        Email *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="w-full px-4 py-3 pl-12 border-2 border-[#E6DCB8] rounded-lg focus:ring-2 focus:ring-[#EDC043] focus:border-[#EDC043] transition-all duration-200 text-[#6B3C10] font-medium"
                          placeholder="Masukkan email"
                          required
                        />
                        <Icon icon="solar:letter-bold" className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-[#6B3C10] mb-2">
                        Nomor Telepon
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          className="w-full px-4 py-3 pl-12 border-2 border-[#E6DCB8] rounded-lg focus:ring-2 focus:ring-[#EDC043] focus:border-[#EDC043] transition-all duration-200 text-[#6B3C10] font-medium"
                          placeholder="Masukkan nomor telepon"
                        />
                        <Icon icon="solar:phone-bold" className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-6 border-t border-[#E6DCB8]">
                    <button
                      type="submit"
                      disabled={updating}
                      className="bg-gradient-to-r from-[#EDC043] to-[#ED9C40] text-white px-8 py-3 rounded-lg hover:from-[#ED9C40] hover:to-[#EDC043] transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {updating ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Memperbarui...
                        </>
                      ) : (
                        <>
                          <Icon icon="solar:check-circle-bold" className="w-5 h-5 mr-2" />
                          Simpan Perubahan
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {activeTab === "password" && (
                <form onSubmit={handleUpdatePassword} className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center">
                      <Icon icon="solar:info-circle-bold" className="w-5 h-5 text-blue-600 mr-2" />
                      <p className="text-sm text-blue-800">
                        Pastikan password baru Anda aman dengan minimal 6 karakter dan kombinasi huruf serta angka.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#6B3C10] mb-2">
                      Password Saat Ini *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords ? "text" : "password"}
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-3 pl-12 pr-12 border-2 border-[#E6DCB8] rounded-lg focus:ring-2 focus:ring-[#EDC043] focus:border-[#EDC043] transition-all duration-200 text-[#6B3C10] font-medium"
                        placeholder="Masukkan password saat ini"
                        required
                      />
                      <Icon icon="solar:lock-password-bold" className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#6B3C10] mb-2">
                      Password Baru *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords ? "text" : "password"}
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3 pl-12 pr-12 border-2 border-[#E6DCB8] rounded-lg focus:ring-2 focus:ring-[#EDC043] focus:border-[#EDC043] transition-all duration-200 text-[#6B3C10] font-medium"
                        placeholder="Masukkan password baru"
                        minLength={6}
                        required
                      />
                      <Icon icon="solar:lock-password-unlocked-bold" className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#6B3C10] mb-2">
                      Konfirmasi Password Baru *
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords ? "text" : "password"}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 pl-12 pr-12 border-2 border-[#E6DCB8] rounded-lg focus:ring-2 focus:ring-[#EDC043] focus:border-[#EDC043] transition-all duration-200 text-[#6B3C10] font-medium"
                        placeholder="Ulangi password baru"
                        minLength={6}
                        required
                      />
                      <Icon icon="solar:shield-check-bold" className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="showPasswords"
                      checked={showPasswords}
                      onChange={e => setShowPasswords(e.target.checked)}
                      className="w-4 h-4 text-[#EDC043] bg-gray-100 border-gray-300 rounded focus:ring-[#EDC043] focus:ring-2"
                    />
                    <label htmlFor="showPasswords" className="ml-2 text-sm text-gray-600">
                      Tampilkan password
                    </label>
                  </div>

                  <div className="flex justify-end pt-6 border-t border-[#E6DCB8]">
                    <button
                      type="submit"
                      disabled={updating}
                      className="bg-gradient-to-r from-[#EDC043] to-[#ED9C40] text-white px-8 py-3 rounded-lg hover:from-[#ED9C40] hover:to-[#EDC043] transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {updating ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Memperbarui...
                        </>
                      ) : (
                        <>
                          <Icon icon="solar:shield-check-bold" className="w-5 h-5 mr-2" />
                          Ubah Password
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      {toast && (
        <Toast 
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </>
  );
}