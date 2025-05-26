'use client'

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface DashboardData {
  summary: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    totalOrders: number;
    activeEmployees: number;
    totalProducts: number;
    totalUsers: number;
  };
  recentOrders: any[];
  topProducts: any[];
  monthlyTrends: {
    revenue: number[];
    orders: number[];
    labels: string[];
  };
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch financial data
      const financeResponse = await fetch('/api/finances?period=month');
      const financeData = financeResponse.ok ? await financeResponse.json() : null;
      
      // Fetch products count
      const productsResponse = await fetch('/api/products');
      const productsData = productsResponse.ok ? await productsResponse.json() : [];
      
      // Fetch users count
      const usersResponse = await fetch('/api/users');
      const usersData = usersResponse.ok ? await usersResponse.json() : [];
      
      if (financeData) {
        setDashboardData({
          summary: {
            totalRevenue: financeData.summary.totalRevenue,
            totalExpenses: financeData.summary.totalExpenses,
            netProfit: financeData.summary.netProfit,
            totalOrders: financeData.summary.totalOrders,
            activeEmployees: financeData.summary.activeEmployees,
            totalProducts: productsData.length || 0,
            totalUsers: usersData.length || 0,
          },
          recentOrders: financeData.revenue.orders.slice(0, 5) || [],
          topProducts: [], // You can calculate this from orders data if needed
          monthlyTrends: {
            revenue: Object.values(financeData.revenue.byDay || {}),
            orders: [],
            labels: Object.keys(financeData.revenue.byDay || {}),
          }
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const profitColor = useMemo(() => {
    if (!dashboardData) return 'text-gray-600';
    return dashboardData.summary.netProfit >= 0 ? 'text-green-600' : 'text-red-600';
  }, [dashboardData]);

  if (loading) {
    return (
      <div className="flex text-black bg-bright-egg-white min-h-screen">
        <div className="px-8 pt-24 flex flex-col gap-y-6 w-full">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full mb-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-gray-300 rounded-xl"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-300 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex text-black bg-bright-egg-white min-h-screen">
        <div className="px-8 pt-24 flex flex-col gap-y-6 w-full">
          <div className="text-center py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Unable to load dashboard data</h1>
            <button 
              onClick={fetchDashboardData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex text-black bg-bright-egg-white min-h-screen">
      <div className="px-8 pt-24 flex flex-col gap-y-6 w-full">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's your business overview.</p>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleString('id-ID')}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {/* Total Revenue */}
          <div className='h-24 bg-white rounded-xl flex justify-between p-4'>
            <div className='text-lg flex flex-col justify-start text-left'>
              <span className='font-medium text-gray-600'>Total Revenue</span>
              <span className='font-semibold text-xl text-green-600'>
                {formatCurrency(dashboardData.summary.totalRevenue)}
              </span>
            </div>
            <div className="flex items-center">
              <Image src="/totalsales.svg" alt="revenue" width={50} height={50}/>
            </div>
          </div>

          {/* Total Orders */}
          <div className='h-24 bg-white rounded-xl flex justify-between p-4'>
            <div className='text-lg flex flex-col justify-start text-left'>
              <span className='font-medium text-gray-600'>Total Orders</span>
              <span className='font-semibold text-2xl text-blue-600'>{dashboardData.summary.totalOrders}</span>
            </div>
            <div className="flex items-center">
              <Image src="/totalorders.svg" alt="orders" width={50} height={50}/>
            </div>
          </div>

          {/* Net Profit */}
          <div className='h-24 bg-white rounded-xl flex justify-between p-4'>
            <div className='text-lg flex flex-col justify-start text-left'>
              <span className='font-medium text-gray-600'>Net Profit</span>
              <span className={`font-semibold text-xl ${profitColor}`}>
                {formatCurrency(dashboardData.summary.netProfit)}
              </span>
            </div>
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                dashboardData.summary.netProfit >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <svg className={`w-6 h-6 ${profitColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {dashboardData.summary.netProfit >= 0 ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                  )}
                </svg>
              </div>
            </div>
          </div>

          {/* Active Employees */}
          <div className='h-24 bg-white rounded-xl flex justify-between p-4'>
            <div className='text-lg flex flex-col justify-start text-left'>
              <span className='font-medium text-gray-600'>Active Employees</span>
              <span className='font-semibold text-2xl text-purple-600'>{dashboardData.summary.activeEmployees}</span>
            </div>
            <div className="flex items-center">
              <Image src="/totalusers.svg" alt="employees" width={50} height={50}/>
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <div className='h-20 bg-white rounded-xl flex justify-between p-4'>
            <div className='flex flex-col justify-center'>
              <span className='font-medium text-gray-600'>Total Products</span>
              <span className='font-semibold text-xl text-gray-800'>{dashboardData.summary.totalProducts}</span>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className='h-20 bg-white rounded-xl flex justify-between p-4'>
            <div className='flex flex-col justify-center'>
              <span className='font-medium text-gray-600'>Total Customers</span>
              <span className='font-semibold text-xl text-gray-800'>{dashboardData.summary.totalUsers}</span>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className='h-20 bg-white rounded-xl flex justify-between p-4'>
            <div className='flex flex-col justify-center'>
              <span className='font-medium text-gray-600'>Total Expenses</span>
              <span className='font-semibold text-xl text-red-600'>{formatCurrency(dashboardData.summary.totalExpenses)}</span>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Recent Orders</h2>
              <Link href="/admin/orders" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {dashboardData.recentOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No recent orders</p>
                </div>
              ) : (
                dashboardData.recentOrders.map((order: any) => (
                  <div key={order.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.product?.name || 'Unknown Product'}</div>
                      <div className="text-xs text-gray-400">{formatDate(order.orderDate)}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-green-600">{formatCurrency(order.totalPrice)}</div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                        order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/admin/orders" className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Manage Orders</div>
                  <div className="text-sm text-gray-500">View and update order status</div>
                </div>
              </Link>

              <Link href="/admin/products" className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Manage Products</div>
                  <div className="text-sm text-gray-500">Add or edit product listings</div>
                </div>
              </Link>

              <Link href="/admin/employees" className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <div>
                  <div className="font-medium">Manage Employees</div>
                  <div className="text-sm text-gray-500">View staff and payroll</div>
                </div>
              </Link>

              <Link href="/admin/finances" className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                </div>
                <div>
                  <div className="font-medium">View Finances</div>
                  <div className="text-sm text-gray-500">Detailed financial reports</div>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-white rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Monthly Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{formatCurrency(dashboardData.summary.totalRevenue)}</div>
              <div className="text-sm text-gray-500">Total Revenue This Month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{dashboardData.summary.totalOrders}</div>
              <div className="text-sm text-gray-500">Orders Processed</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${profitColor}`}>{formatCurrency(dashboardData.summary.netProfit)}</div>
              <div className="text-sm text-gray-500">Net Profit</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}