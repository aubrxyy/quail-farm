"use client";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import Header from "../_components/Header";

export default function UserPage() {
  const [user, setUser] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userRes = await fetch("/api/auth/validate");
        const userData = await userRes.json();
        
        // Fetch user creation date from /api/users
        const usersRes = await fetch("/api/users");
        const usersData = await usersRes.json();
        
        // Fetch addresses count
        const addressRes = await fetch("/api/addresses");
        const addressData = await addressRes.json();
        
        // Fetch orders count
        const ordersRes = await fetch("/api/orders");
        const ordersData = await ordersRes.json();
        
        setUser(userData.user);
        setAddresses(addressData);
        setOrders(ordersData);
        
        // If we have users data, get the creation date for current user
        if (usersData && usersData.length > 0) {
          const currentUserData = usersData.find((u: any) => u.email === userData.user?.email);
          if (currentUserData) {
            setUser((prev: any) => ({ ...prev, createdAt: currentUserData.createdAt }));
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to format member since date
  const getMemberSince = (createdAt: string) => {
    if (!createdAt) return "2024";
    const date = new Date(createdAt);
    return date.getFullYear().toString();
  };

  const getOrderCounts = () => {
    const pending = orders.filter(order => order.status === 'PENDING').length;
    const completed = orders.filter(order => order.status === 'COMPLETED').length;
    const cancelled = orders.filter(order => order.status === 'CANCELLED').length;
    
    return { pending, completed, cancelled, total: orders.length };
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className='bg-[#F7F4E8] min-h-screen pt-28'>
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Card Loading */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg p-8 animate-pulse">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-[#E6DCB8] rounded-full mb-4"></div>
                    <div className="h-6 bg-[#E6DCB8] rounded w-32 mb-2"></div>
                    <div className="h-4 bg-[#E6DCB8] rounded w-40 mb-1"></div>
                    <div className="h-4 bg-[#E6DCB8] rounded w-36"></div>
                  </div>
                </div>
              </div>
              
              {/* Menu Loading */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
                      <div className="h-16 bg-[#E6DCB8] rounded"></div>
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
  
  const orderCounts = getOrderCounts();

  const menuItems = [
    {
      href: "/user/account",
      icon: "solar:user-bold-duotone",
      title: "Detail Akun",
      description: "Kelola informasi profil dan keamanan akun Anda",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      href: "/user/order-history",
      icon: "solar:bag-smile-bold-duotone",
      title: "Riwayat Pesanan",
      description: "Lihat semua pesanan dan status pengiriman Anda",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      href: "/user/address",
      icon: "solar:map-point-bold-duotone",
      title: "Alamat Pengiriman",
      description: "Atur alamat pengiriman untuk kemudahan berbelanja",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600"
    }
  ];

  return (
    <>
      <Header />
      <div className='bg-[#F7F4E8] min-h-screen pt-28'>
        <div className="max-w-7xl mx-auto px-6 py-8">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-xl border border-[#E6DCB8] overflow-hidden">
                {/* Profile Header with Gradient */}
                <div className="bg-gradient-to-br from-[#EDC043] to-[#ED9C40] px-8 py-10 text-center relative">
                  <div className="absolute inset-0 bg-gradient-to-tl from-yellow-start to-yellow-end bg-opacity-10"></div>
                  <div className="relative text-[#6B3C10]">
                    <div className="w-28 h-28 bg-white bg-opacity-20 backdrop-blur-sm rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-white border-opacity-30">
                      <Icon icon="solar:user-bold" className="w-12 h-12" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{user?.name || "User Name"}</h2>
                    <div className="space-y-1">
                      <p className=" text-opacity-90 flex items-center justify-center">
                        <Icon icon="solar:letter-bold" className="w-4 h-4 mr-2" />
                        {user?.email || "email@example.com"}
                      </p>
                      {user?.phone && (
                        <p className="text-opacity-90 flex items-center justify-center">
                          <Icon icon="solar:phone-bold" className="w-4 h-4 mr-2" />
                          {user.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Profile Stats */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-[#F7F4E8] rounded-2xl">
                      <div className="text-2xl font-bold text-[#6B3C10]">{orderCounts.total}</div>
                      <div className="text-sm text-gray-600">Total Pesanan</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {orderCounts.pending > 0 ? `${orderCounts.pending} Pending` : 'Semua selesai'}
                      </div>
                    </div>
                    <div className="text-center p-4 bg-[#F7F4E8] rounded-2xl">
                      <div className="text-2xl font-bold text-[#6B3C10]">{addresses.length}</div>
                      <div className="text-sm text-gray-600">Alamat Aktif</div>
                    </div>
                  </div>

                  {/* Member Since */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-[#EDC043] to-[#ED9C40] bg-opacity-10 rounded-2xl border border-[#EDC043] border-opacity-20">
                    <div className="flex items-center justify-center text-[#6B3C10]">
                      <Icon icon="solar:crown-bold" className="w-5 h-5 mr-2 " />
                        <span className="font-medium">
                        Member sejak {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) : "2024"}
                        </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Cards */}
            <div className="lg:col-span-2 ">
              <div className="flex flex-col space-y-3">
                {menuItems.map((item, index) => (
                  <Link key={index} href={item.href}>
                    <div className="group bg-white rounded-3xl shadow-lg border border-[#E6DCB8] overflow-hidden hover:shadow-xl transition-all duration-300 transform cursor-pointer">
                      <div className="p-9">
                        <div className="flex items-center">
                          {/* Icon Container */}
                          <div className={`w-20 h-20 ${item.bgColor} rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                            <Icon icon={item.icon} className={`w-10 h-10 ${item.iconColor}`} />
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-[#6B3C10] mb-2 group-hover:text-[#ED9C40] transition-colors duration-300">
                              {item.title}
                            </h3>
                            <p className="text-gray-600 text-lg leading-relaxed">
                              {item.description}
                            </p>
                          </div>

                          {/* Arrow */}
                          <div className="ml-6">
                            <div className="w-12 h-12 bg-[#F7F4E8] rounded-full flex items-center justify-center group-hover:bg-[#EDC043] transition-all duration-300">
                              <Icon icon="solar:arrow-right-bold" className="w-6 h-6 text-[#6B3C10] group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Border Animation */}
                      <div className={`h-1 bg-gradient-to-r ${item.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
                    </div>
                  </Link>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}