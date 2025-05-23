import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';

// Helper to fetch with cookies on the server
async function fetchWithCookies(url: string) {
  // Always use absolute URL for fetch in server components
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';
  const absUrl = url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;

  // Await cookies() properly
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value || '';
  const res = await fetch(absUrl, {
    headers: { Cookie: session ? `session=${session}` : '' },
    cache: 'no-store',
  });
  return res.json();
}

export default async function UserPage() {
  // Fetch user biodata
  const userRes = await fetchWithCookies('/api/auth/validate');
  const user = userRes.user || null;

  // Fetch orders
  const ordersRes = await fetchWithCookies('/api/orders');
  const orders = Array.isArray(ordersRes) ? ordersRes : [];

  // Fetch addresses
  const addressesRes = await fetchWithCookies('/api/addresses');
  const addresses = Array.isArray(addressesRes) ? addressesRes : [];

  return (
    <div className="min-h-screen bg-[#f6f3e7] flex flex-col items-center py-12 px-4">
      {/* Header Section */}
      <div className="w-full max-w-4xl text-center mb-12">
        <h1 className="text-4xl font-extrabold text-[#EDC043] mb-2 tracking-wide" style={{ letterSpacing: 2 }}>USER PROFILE</h1>
        <p className="text-[#6B3C10] text-lg font-medium">Your biodata, orders, and addresses</p>
      </div>
      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        {/* Biodata Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-[#EDC043] flex items-center justify-center text-4xl font-bold text-white mb-4">
            {user?.name?.[0] || '?'}
          </div>
          <h2 className="text-xl font-bold mb-2">{user?.name || 'User Name'}</h2>
          <p className="text-gray-600 mb-1">{user?.email || 'user@email.com'}</p>
          <p className="text-gray-400 text-sm">{user?.phone && <>Phone: {user.phone}<br /></>}Joined: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</p>
        </div>
        {/* Orders Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4">Orders</h2>
          {orders.length === 0 ? (
            <p className="text-gray-400">No orders yet.</p>
          ) : (
            <ul className="w-full">
              {orders.slice(0, 3).map((order: any) => (
                <li key={order.id} className="mb-4 border-b pb-2 last:border-b-0 last:mb-0">
                  <div className="font-semibold text-[#6B3C10]">{order.product?.name}</div>
                  <div className="text-sm text-gray-500">{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '-'} &middot; {order.status}</div>
                  <div className="text-[#EDC043] font-bold">Rp {order.totalPrice?.toLocaleString('id-ID')}</div>
                </li>
              ))}
            </ul>
          )}
          <Link href="/orders" className="mt-6 inline-block bg-[#EDC043] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#f6a700] transition">View All Orders</Link>
        </div>
        {/* Addresses Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4">Addresses</h2>
          {addresses.length === 0 ? (
            <p className="text-gray-400">No addresses yet.</p>
          ) : (
            <ul className="w-full">
              {addresses.slice(0, 3).map((address: any) => (
                <li key={address.id} className="mb-4 border-b pb-2 last:border-b-0 last:mb-0">
                  <div className="font-semibold text-[#6B3C10]">{address.street}</div>
                  <div className="text-sm text-gray-500">{address.city}, {address.province} {address.postalCode}</div>
                </li>
              ))}
            </ul>
          )}
          <Link href="/addresses" className="mt-6 inline-block bg-[#EDC043] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#f6a700] transition">Manage Addresses</Link>
        </div>
      </div>
    </div>
  );
}