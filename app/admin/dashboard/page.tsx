'use client'

import Image from "next/image";
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Link from 'next/link';

const OrderMap = dynamic(() => import('@/app/_components/OrderMap'), {
  ssr: false
});

import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { format, parseISO } from 'date-fns';

const orders = [
  // 3 orders on 2025-05-01
  { id: '1', address: 'Jl. Raya Pajajaran No.1, Bogor Tengah', lat: -6.595, lng: 106.816, customerName: 'John Doe', products: ['Quail Eggs'], status: 'Completed', date: '2025-05-01', amount: 12, total: 150000 },
  { id: '2', address: 'Jl. Suryakencana No.10, Bogor Tengah', lat: -6.613, lng: 106.799, customerName: 'Jane Smith', products: ['Fresh Eggs'], status: 'Processing', date: '2025-05-01', amount: 24, total: 300000 },
  { id: '3', address: 'Jl. Pandu Raya No.5, Bogor Utara', lat: -6.570, lng: 106.806, customerName: 'Bob Johnson', products: ['Premium Eggs'], status: 'Completed', date: '2025-05-01', amount: 18, total: 225000 },
  // 1 order on 2025-05-04
  { id: '4', address: 'Jl. Raya Cilebut No.8, Tanah Sareal', lat: -6.573, lng: 106.782, customerName: 'Alice Brown', products: ['Organic Eggs'], status: 'Processing', date: '2025-05-04', amount: 30, total: 450000 },
  // 4 orders on 2025-05-07
  { id: '5', address: 'Jl. Raya Tajur No.20, Bogor Timur', lat: -6.635, lng: 106.830, customerName: 'Charlie Wilson', products: ['Standard Eggs'], status: 'Completed', date: '2025-05-07', amount: 15, total: 180000 },
  { id: '6', address: 'Jl. Raya Sukasari No.15, Bogor Timur', lat: -6.617, lng: 106.822, customerName: 'Diana Lee', products: ['Fresh Eggs'], status: 'Processing', date: '2025-05-07', amount: 20, total: 250000 },
  { id: '7', address: 'Jl. Raya Ciomas No.3, Ciomas', lat: -6.646, lng: 106.770, customerName: 'Edward Kim', products: ['Premium Eggs'], status: 'Completed', date: '2025-05-07', amount: 25, total: 312500 },
  { id: '8', address: 'Jl. Raya Laladon No.7, Dramaga', lat: -6.570, lng: 106.726, customerName: 'Fiona Chen', products: ['Organic Eggs'], status: 'Processing', date: '2025-05-07', amount: 22, total: 330000 },
  // 2 orders on 2025-05-10
  { id: '9', address: 'Jl. Raya Cibinong No.12, Cibinong', lat: -6.485, lng: 106.853, customerName: 'George Park', products: ['Quail Eggs'], status: 'Completed', date: '2025-05-10', amount: 16, total: 200000 },
  { id: '10', address: 'Jl. Raya Parung No.2, Parung', lat: -6.441, lng: 106.741, customerName: 'Helen Wang', products: ['Fresh Eggs'], status: 'Processing', date: '2025-05-10', amount: 28, total: 350000 },
  // 5 orders on 2025-05-15
  { id: '11', address: 'Jl. Raya Batutulis No.1, Bogor Selatan', lat: -6.629, lng: 106.803, customerName: 'Ivan Rodriguez', products: ['Standard Eggs'], status: 'Completed', date: '2025-05-15', amount: 14, total: 168000 },
  { id: '12', address: 'Jl. Pahlawan No.9, Bogor Selatan', lat: -6.637, lng: 106.803, customerName: 'Julia Martinez', products: ['Premium Eggs'], status: 'Processing', date: '2025-05-15', amount: 26, total: 325000 },
  { id: '13', address: 'Jl. Empang No.3, Bogor Selatan', lat: -6.626, lng: 106.799, customerName: 'Kevin Thompson', products: ['Organic Eggs'], status: 'Completed', date: '2025-05-15', amount: 32, total: 480000 },
  { id: '14', address: 'Jl. Cipaku Indah No.5, Bogor Selatan', lat: -6.646, lng: 106.803, customerName: 'Lisa Anderson', products: ['Fresh Eggs'], status: 'Processing', date: '2025-05-15', amount: 19, total: 237500 },
  { id: '15', address: 'Jl. Raya Mulyaharja No.2, Bogor Selatan', lat: -6.661, lng: 106.803, customerName: 'Mike Davis', products: ['Quail Eggs'], status: 'Completed', date: '2025-05-15', amount: 21, total: 262500 },
  // 1 order on 2025-05-20
  { id: '16', address: 'Jl. Raya Cikaret No.10, Cibinong', lat: -6.509, lng: 106.836, customerName: 'Nancy Taylor', products: ['Standard Eggs'], status: 'Processing', date: '2025-05-20', amount: 17, total: 204000 },
  // 3 orders on 2025-05-25
  { id: '17', address: 'Jl. Raya Sholeh Iskandar No.1, Tanah Sareal', lat: -6.573, lng: 106.782, customerName: 'Oscar Garcia', products: ['Premium Eggs'], status: 'Completed', date: '2025-05-25', amount: 23, total: 287500 },
  { id: '18', address: 'Jl. Raya Cemplang No.8, Bogor Barat', lat: -6.561, lng: 106.741, customerName: 'Paula White', products: ['Organic Eggs'], status: 'Processing', date: '2025-05-25', amount: 27, total: 405000 },
  { id: '19', address: 'Jl. Raya Gunung Batu No.5, Bogor Barat', lat: -6.573, lng: 106.785, customerName: 'Quinn Lee', products: ['Fresh Eggs'], status: 'Completed', date: '2025-05-25', amount: 24, total: 300000 },
  // 2 orders on 2025-06-01
  { id: '20', address: 'Jl. Raya Ciawi No.3, Ciawi', lat: -6.693, lng: 106.900, customerName: 'Rachel Brown', products: ['Quail Eggs'], status: 'Processing', date: '2025-06-01', amount: 18, total: 225000 },
  { id: '21', address: 'Jl. Raya Gadog No.2, Ciawi', lat: -6.693, lng: 106.900, customerName: 'Sam Wilson', products: ['Standard Eggs'], status: 'Completed', date: '2025-06-01', amount: 20, total: 240000 },
  // 4 orders on 2025-06-10
  { id: '22', address: 'Jl. Raya Sukaraja No.7, Sukaraja', lat: -6.532, lng: 106.849, customerName: 'Tina Johnson', products: ['Premium Eggs'], status: 'Processing', date: '2025-06-10', amount: 29, total: 362500 },
  { id: '23', address: 'Jl. Raya Cileungsi No.4, Cileungsi', lat: -6.412, lng: 106.959, customerName: 'Uma Patel', products: ['Organic Eggs'], status: 'Completed', date: '2025-06-10', amount: 31, total: 465000 },
  { id: '24', address: 'Jl. Raya Bojonggede No.6, Bojonggede', lat: -6.496, lng: 106.821, customerName: 'Victor Chen', products: ['Fresh Eggs'], status: 'Processing', date: '2025-06-10', amount: 25, total: 312500 },
  { id: '25', address: 'Jl. Raya Kemang No.9, Kemang', lat: -6.496, lng: 106.786, customerName: 'Wendy Kim', products: ['Quail Eggs'], status: 'Completed', date: '2025-06-10', amount: 22, total: 275000 },
];

// Group orders by date
interface Order {
    id: string;
    address: string;
    lat: number;
    lng: number;
    customerName: string;
    products: string[];
    status: string;
    date: string;
    amount: number;
    total: number;
}

interface OrderCountByDate {
    date: string;
    count: number;
}

const getOrderCountsByDate = (orders: Order[]): OrderCountByDate[] => {
    const counts: Record<string, number> = {};
    orders.forEach(order => {
      counts[order.date] = (counts[order.date] || 0) + 1;
    });
    return Object.entries(counts).map(([date, count]) => ({ date, count }));
};

export default function Dashboard() {
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredOrders = statusFilter === 'all' 
        ? orders 
        : orders.filter(order => order.status === statusFilter);

    const totalUsers = 12345;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = orders.filter(order => order.status === 'Processing').length;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getStatusColor = (status: string) => {
        return status === 'Completed' 
            ? 'bg-green-500 text-white' 
            : 'bg-yellow-500 text-white';
    };

    // Recent orders (latest 5)
    const recentOrders = orders
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

    return (
        <div className="flex text-black bg-bright-egg-white min-h-screen">
            <div className="px-8 pt-24 flex flex-col gap-y-6 w-full">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                    <Link href="/admin/users" className='h-24 bg-white rounded-xl flex justify-between p-4 hover:shadow-lg transition-shadow cursor-pointer'>
                        <div className='text-lg flex flex-col justify-start text-left'>
                            <span className='font-medium text-gray-600'>Total Users</span>
                            <span className='font-semibold text-2xl lg:text-3xl text-black'>{totalUsers.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center">
                            <Image src="/totalusers.svg" alt="users_total" width={60} height={60}/>
                        </div>
                    </Link>
                    
                    <Link href="/admin/orders" className='h-24 bg-white rounded-xl flex justify-between p-4 hover:shadow-lg transition-shadow cursor-pointer'>
                        <div className='text-lg flex flex-col justify-start text-left'>
                            <span className='font-medium text-gray-600'>Total Orders</span>
                            <span className='font-semibold text-2xl lg:text-3xl text-black'>{totalOrders.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center">
                            <Image src="/totalorders.svg" alt="orders_total" width={60} height={60}/>
                        </div>
                    </Link>
                    
                    <div className='h-24 bg-white rounded-xl flex justify-between p-4'>
                        <div className='text-lg flex flex-col justify-start text-left'>
                            <span className='font-medium text-gray-600'>Total Revenue</span>
                            <span className='font-semibold text-lg lg:text-xl text-black mt-1'>{formatCurrency(totalRevenue)}</span>
                        </div>
                        <div className="flex items-center">
                            <Image src="/totalsales.svg" alt="sales_total" width={60} height={60}/>
                        </div>
                    </div>
                    
                    <Link href="/admin/orders?status=pending" className='h-24 bg-white rounded-xl flex justify-between p-4 hover:shadow-lg transition-shadow cursor-pointer'>
                        <div className='text-lg flex flex-col justify-start text-left'>
                            <span className='font-medium text-gray-600'>Orders Pending</span>
                            <span className='font-semibold text-2xl lg:text-3xl text-black'>{pendingOrders}</span>
                        </div>
                        <div className="flex items-center">
                            <Image src="/totalpending.svg" alt="order-pending" width={60} height={60}/>
                        </div>
                    </Link>
                </div>

                {/* Orders Map */}
                <div className="h-96 bg-white rounded-xl p-4 relative">
                    <div className="absolute top-4 left-4 z-20">
                        <h3 className="text-lg font-semibold text-gray-700">Orders Distribution</h3>
                    </div>
                    <div className="absolute bottom-5 left-5 z-20 shadow-lg">
                        <select
                            id="statusFilter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border border-gray-300 rounded-md p-2 w-48 bg-white text-sm"
                        >
                            <option value="all">Filter Orders (All)</option>
                            <option value="Processing">Processing</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div className="absolute bottom-5 right-5 z-20 bg-white p-2 rounded shadow-lg">
                        <div className="text-sm text-gray-600">
                            Showing: <span className="font-semibold">{filteredOrders.length}</span> orders
                        </div>
                    </div>
                  <div className="w-full h-full rounded-md overflow-hidden z-10">
                      <OrderMap orders={filteredOrders.map(order => ({
                          id: order.id,
                          customerName: order.customerName,
                          customerAddress: order.address, // map address to customerAddress
                          lat: order.lat,
                          lng: order.lng,
                          status: order.status,
                          product: { name: order.products[0] }, // map products[0] to product object
                          totalPrice: order.total,
                          orderAmount: order.amount
                      }))} />
                  </div>
                </div>

                {/* Sales Details */}
                <div className='h-auto bg-white rounded-xl p-6 lg:p-8'>
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-xl lg:text-2xl text-gray-600 font-semibold">Recent Sales</span>
                        <Link href="/admin/orders" className="text-blue-600 hover:text-blue-800 font-medium text-sm lg:text-base">
                            View All Orders →
                        </Link>
                    </div>
                    
                    {/* Desktop Header */}
                    <div className="hidden lg:grid lg:grid-cols-6 gap-x-4 text-sm font-medium bg-gray-100 rounded-xl h-12 w-full p-4 items-center">
                        <span>Product</span>
                        <span>Customer</span>
                        <span>Date</span>
                        <span>Amount</span>
                        <span>Total</span>
                        <span>Status</span>
                    </div>
                    
                    {/* Orders List */}
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {recentOrders.map((order) => (
                            <div key={order.id} className="grid grid-cols-1 lg:grid-cols-6 gap-4 lg:gap-x-4 text-sm border border-gray-100 lg:border-b lg:border-x-0 lg:border-t-0 w-full p-4 lg:pb-4 lg:px-4 items-start lg:items-center hover:bg-gray-50 rounded lg:rounded-none">
                                <div className="flex items-center gap-x-3">
                                    <Image 
                                        src="/uploads/puyuhpotong.png" 
                                        alt={order.products[0]} 
                                        width={40} 
                                        height={40}
                                        className="rounded object-cover flex-shrink-0"
                                    />
                                    <div className="flex flex-col min-w-0">
                                        <span className="font-medium truncate">{order.products[0]}</span>
                                        <span className="text-xs text-gray-500">#{order.id}</span>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col lg:mt-0 mt-2">
                                    <span className="font-medium">{order.customerName}</span>
                                    <span className="text-xs text-gray-500 truncate">
                                        {order.address.length > 30 ? `${order.address.substring(0, 30)}...` : order.address}
                                    </span>
                                </div>
                                
                                <div className="lg:mt-0 mt-2">
                                    <span className="text-sm">{formatDate(order.date)}</span>
                                </div>
                                
                                <div className="lg:mt-0 mt-2">
                                    <span className="font-medium">{order.amount} pcs</span>
                                </div>
                                
                                <div className="lg:mt-0 mt-2">
                                    <span className="font-medium">{formatCurrency(order.total)}</span>
                                </div>
                                
                                <div className="lg:mt-0 mt-2">
                                    <span className={`${getStatusColor(order.status)} inline-block text-center font-semibold rounded-full px-3 py-1 text-xs`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Link href="/admin/products/new" className="bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 transition-colors text-center">
                        <div className="flex flex-col items-center gap-2">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            <span className="font-medium">Add New Product</span>
                        </div>
                    </Link>
                    
                    <Link href="/admin/orders?status=pending" className="bg-yellow-500 text-white p-4 rounded-xl hover:bg-yellow-600 transition-colors text-center">
                        <div className="flex flex-col items-center gap-2">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span className="font-medium">Pending Orders</span>
                            <span className="text-sm">({pendingOrders})</span>
                        </div>
                    </Link>
                    
                    <Link href="/admin/products" className="bg-green-600 text-white p-4 rounded-xl hover:bg-green-700 transition-colors text-center">
                        <div className="flex flex-col items-center gap-2">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"></path>
                            </svg>
                            <span className="font-medium">Manage Products</span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}