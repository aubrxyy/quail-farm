"use client";
import Header from "@/app/_components/Header";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          )}
          <span className="font-medium">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  address 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onConfirm: () => void,
  address: any
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-2xl px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-bold text-[#6B3C10]">
                Hapus Alamat
              </h3>
              <div className="mt-3">
                <p className="text-sm text-gray-500 mb-3">
                  Apakah Anda yakin ingin menghapus alamat ini? Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="bg-[#F7F4E8] p-3 rounded-lg border border-[#E6DCB8]">
                  <p className="font-medium text-[#6B3C10] text-sm mb-1">
                    {address?.label || "Alamat"}
                  </p>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {address?.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
              onClick={onConfirm}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Hapus Alamat
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-lg border border-[#E6DCB8] shadow-sm px-4 py-2 bg-white text-base font-medium text-[#6B3C10] hover:bg-[#F7F4E8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EDC043] sm:mt-0 sm:w-auto sm:text-sm transition-colors duration-200"
              onClick={onClose}
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PageAlamat() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, address: any }>({ isOpen: false, address: null });
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/addresses")
      .then(res => res.json())
      .then(data => {
        setAddresses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Check for success message from edit/add operations
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const edited = urlParams.get('edited');
    
    if (success === 'true') {
      setToast({ message: 'Alamat berhasil ditambahkan!', type: 'success' });
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (edited === 'true') {
      setToast({ message: 'Alamat berhasil diperbarui!', type: 'success' });
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleDeleteClick = (address: any) => {
    setDeleteModal({ isOpen: true, address });
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`/api/addresses/${deleteModal.address.id}`, { 
        method: "DELETE" 
      });
      
      if (response.ok) {
        setAddresses(addresses.filter(a => a.id !== deleteModal.address.id));
        setToast({ message: 'Alamat berhasil dihapus!', type: 'success' });
      } else {
        setToast({ message: 'Gagal menghapus alamat. Silakan coba lagi.', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'Terjadi kesalahan. Silakan coba lagi.', type: 'error' });
    }
    
    setDeleteModal({ isOpen: false, address: null });
  };

  const handleEdit = (id: number) => {
    router.push(`/user/address/${id}`);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className='bg-[#F7F4E8] min-h-screen pt-28'>
          <div className="max-w-4xl mx-auto px-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-[#E6DCB8] rounded w-1/4"></div>
              <div className="h-12 bg-[#E6DCB8] rounded w-1/3"></div>
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 bg-[#E6DCB8] rounded-xl"></div>
                ))}
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
        <div className="max-w-4xl mx-auto py-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link 
              href="/user" 
              className="inline-flex items-center text-[#6B3C10] hover:text-[#ED9C40] transition-colors duration-200 font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Kembali ke Dashboard
            </Link>
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#6B3C10] mb-2">Alamat Saya</h1>
              <p className="text-gray-600">Kelola alamat pengiriman Anda</p>
            </div>
            <Link href='/user/address/add'>
              <button className="cursor-pointer mt-4 sm:mt-0 inline-flex items-center bg-gradient-to-r from-[#EDC043] to-[#ED9C40] text-white px-6 py-3 rounded-xl hover:from-[#ED9C40] hover:to-[#EDC043] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tambah Alamat Baru
              </button>
            </Link>
          </div>

          {/* Content */}
          {addresses.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-[#E6DCB8] rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-[#6B3C10]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#6B3C10] mb-2">Belum Ada Alamat</h3>
              <p className="text-gray-500 mb-6">Anda belum memasukkan alamat pengiriman.</p>
              <Link href='/user/address/add'>
                <button className="inline-flex items-center bg-[#ED9C40] text-white px-6 py-3 rounded-xl hover:bg-[#EDC043] transition-colors duration-200 font-medium">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah Alamat Pertama
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6">
              {addresses.map((address) => (
                <div key={address.id} className="bg-white rounded-2xl shadow-sm border border-[#E6DCB8] overflow-hidden hover:shadow-md transition-shadow duration-200">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <div className="w-2 h-2 bg-[#ED9C40] rounded-full mr-3"></div>
                          <span className="font-semibold text-lg text-[#6B3C10]">
                            {address.label || "Alamat Utama"}
                          </span>
                          {address.isDefault && (
                            <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Utama
                            </span>
                          )}
                        </div>
                        <div className="space-y-2">
                          <p className="text-[#6B3C10] leading-relaxed">{address.address}</p>
                          <p className="text-sm text-gray-500">
                            {address.district}, {address.city}, {address.country} {address.postalCode}
                          </p>
                        </div>
                      </div>
                      <div className="ml-6 flex items-center space-x-1">
                        <button
                          className="cursor-pointer inline-flex items-center px-3 py-2 text-sm font-medium text-yellow-600 bg-orange-100 hover:bg-orange-50 bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors duration-200"
                          onClick={() => handleEdit(address.id)}
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Ubah
                        </button>
                        <button
                          className="cursor-pointer inline-flex items-center px-3 py-2 text-sm font-medium text-red-50 bg-red-600 hover:bg-red-400 rounded-lg transition-colors duration-200"
                          onClick={() => handleDeleteClick(address)}
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Statistics */}
          {addresses.length > 0 && (
            <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-[#E6DCB8]">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-orange-100 bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-[#ED9C40]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-[#6B3C10]">Total Alamat</p>
                    <p className="text-sm text-gray-500">{addresses.length} alamat tersimpan</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#ED9C40]">{addresses.length}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, address: null })}
        onConfirm={handleDeleteConfirm}
        address={deleteModal.address}
      />

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