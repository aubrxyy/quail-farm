'use client';

import { useState, useEffect } from 'react';
import OrderMap from '@/app/_components/OrderMap';

interface Product {
  id: number;
  name: string;
  harga: number;
  stok: number;
}

interface Order {
  id: number;
  userId: number;
  productId: number;
  customerName: string;
  customerAddress: string;
  orderDate: string;
  orderType: string;
  orderAmount: number;
  totalPrice: number;
  status: string;
  product: Product;
  address?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  user?: {
    addresses?: Array<{
      latitude: number;
      longitude: number;
      address: string;
    }>;
  };
}

interface ExtraCost {
  id: number;
  name: string;
  amount: number;
  category: string;
  date: string;
}

interface Employee {
  id: number;
  name: string;
  position: string;
  salary: number;
  status: string;
}

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  lowStockProducts: number;
  pendingOrders: number;
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [extraCosts, setExtraCosts] = useState<ExtraCost[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    lowStockProducts: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'monthly'>('overview');

  // Farm address
  const farmAddress = {
    lat: -6.605898920570076,
    lng: 106.8517554378589,
    address: 'Kp. Cibitung, Nagrak, Kec. Sukaraja, Kabupaten Bogor, Jawa Barat 16151'
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [ordersRes, productsRes, extraCostsRes, employeesRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/products'),
        fetch('/api/extra-costs'),
        fetch('/api/employees')
      ]);

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      } else {
        console.error('Orders fetch failed:', ordersRes.status);
      }

      if (productsRes.ok) {
        const productsData = await productsRes.json();
        setProducts(productsData);
      } else {
        console.error('Products fetch failed:', productsRes.status);
      }

      if (extraCostsRes.ok) {
        const extraCostsData = await extraCostsRes.json();
        setExtraCosts(extraCostsData);
      } else {
        console.error('Extra costs fetch failed:', extraCostsRes.status);
      }

      if (employeesRes.ok) {
        const employeesData = await employeesRes.json();
        setEmployees(employeesData);
      } else {
        console.error('Employees fetch failed:', employeesRes.status);
      }

    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from real data
  useEffect(() => {
    if (orders.length > 0 || products.length > 0) {
      const totalRevenue = orders
        .filter(order => order.status === 'DELIVERED')
        .reduce((sum, order) => sum + order.totalPrice, 0);

      const uniqueCustomers = new Set(orders.map(order => order.userId)).size;
      const lowStockProducts = products.filter(product => product.stok <= 10).length;
      const pendingOrders = orders.filter(order => 
        ['PENDING', 'PROCESSING'].includes(order.status)
      ).length;

      setStats({
        totalRevenue,
        totalOrders: orders.length,
        totalProducts: products.length,
        totalCustomers: uniqueCustomers,
        lowStockProducts,
        pendingOrders
      });
    }
  }, [orders, products]);

  // Transform orders for the new OrderMap component
  const transformedOrders = orders
    .filter(order => order.address?.latitude && order.address?.longitude) // Only orders with valid addresses
    .map(order => ({
      id: order.id.toString(),
      customerName: order.customerName,
      customerAddress: order.customerAddress,
      address: {
        latitude: order.address!.latitude,
        longitude: order.address!.longitude,
      },
      status: order.status,
      product: { name: order.product?.name || 'Unknown Product' },
      totalPrice: order.totalPrice,
      orderAmount: order.orderAmount,
    }));

  // Get recent orders (last 15 for scrolling)
  const recentOrders = orders
    .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
    .slice(0, 15);

  // Get low stock products
  const lowStockProductsList = products
    .filter(product => product.stok <= 10)
    .sort((a, b) => a.stok - b.stok);

  // Calculate monthly expenses
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyExpenses = extraCosts
    .filter(cost => {
      const costDate = new Date(cost.date);
      return costDate.getMonth() === currentMonth && costDate.getFullYear() === currentYear;
    })
    .reduce((sum, cost) => sum + cost.amount, 0);

  // Calculate employee expenses
  const monthlyEmployeeCosts = employees
    .filter(emp => emp.status === 'Active')
    .reduce((sum, emp) => sum + emp.salary, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'pending': return 'text-blue-600 bg-blue-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex text-black bg-bright-egg-white min-h-screen">
        <div className="px-8 pt-4 flex flex-col gap-y-6 w-full">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded w-48"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-300 rounded-xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2].map(i => (
                <div key={i} className="h-64 bg-gray-300 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex text-black bg-bright-egg-white min-h-screen">
      <div className="px-8 pt-4 flex flex-col gap-y-6 w-full">
        
        {/* Header with Tabs */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your quail farm.</p>
          
          {/* Tab Navigation */}
          <div className="mt-4 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('monthly')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'monthly'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Monthly Summary
              </button>
            </nav>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Products</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Customers</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
                  </div>
                  <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Alert Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stats.lowStockProducts > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Low Stock Alert</h3>
                      <p className="mt-1 text-sm text-yellow-700">{stats.lowStockProducts} products are running low on stock</p>
                    </div>
                  </div>
                </div>
              )}

              {stats.pendingOrders > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Pending Orders</h3>
                      <p className="mt-1 text-sm text-blue-700">{stats.pendingOrders} orders need attention</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* NEW: Real Road Routing Map */}
            <OrderMap orders={transformedOrders} farmLocation={farmAddress} />

            {/* Recent Orders, Low Stock & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Recent Orders - Now Scrollable */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Orders</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {recentOrders.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No recent orders</p>
                  ) : (
                    recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div>
                          <p className="font-medium text-sm">{order.customerName}</p>
                          <p className="text-xs text-gray-500">{order.product?.name || 'Unknown Product'} × {order.orderAmount}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(order.orderDate).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">{formatCurrency(order.totalPrice)}</p>
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Low Stock Products */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Low Stock Products</h2>
                <div className="space-y-3">
                  {lowStockProductsList.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">All products are well stocked</p>
                  ) : (
                    lowStockProductsList.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-gray-500">{formatCurrency(product.harga)}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            product.stok === 0 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {product.stok} left
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button 
                    onClick={() => window.location.href = '/admin/orders'}
                    className="w-full p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-800">View All Orders</p>
                        <p className="text-xs text-gray-500">Manage customer orders</p>
                      </div>
                    </div>
                  </button>

                  <button 
                    onClick={() => window.location.href = '/admin/products'}
                    className="w-full p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-800">Manage Products</p>
                        <p className="text-xs text-gray-500">Add or update products</p>
                      </div>
                    </div>
                  </button>

                  <button 
                    onClick={() => window.location.href = '/admin/finances'}
                    className="w-full p-3 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-800">View Finances</p>
                        <p className="text-xs text-gray-500">Track expenses & revenue</p>
                      </div>
                    </div>
                  </button>

                  <button 
                    onClick={() => window.location.href = '/admin/employees'}
                    className="w-full p-3 bg-orange-50 hover:bg-orange-100 rounded-lg text-left transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="h-4 w-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-800">Manage Employees</p>
                        <p className="text-xs text-gray-500">Employee records</p>
                      </div>
                    </div>
                  </button>

                  <button 
                    onClick={() => setActiveTab('monthly')}
                    className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                        <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-800">Monthly Report</p>
                        <p className="text-xs text-gray-500">Detailed summary</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

            </div>
          </>
        )}

        {/* Monthly Summary Tab */}
        {activeTab === 'monthly' && (
          <div className="space-y-6">
            {/* Monthly Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="text-center">
                  <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-xs text-gray-500 mt-1">From {stats.totalOrders} orders</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="text-center">
                  <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(monthlyExpenses + monthlyEmployeeCosts)}</p>
                  <p className="text-sm text-gray-600">Total Expenses</p>
                  <p className="text-xs text-gray-500 mt-1">Operations + Salaries</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="text-center">
                  <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </div>
                  <p className={`text-2xl font-bold ${stats.totalRevenue - (monthlyExpenses + monthlyEmployeeCosts) >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {formatCurrency(stats.totalRevenue - (monthlyExpenses + monthlyEmployeeCosts))}
                  </p>
                  <p className="text-sm text-gray-600">Net Profit</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {((stats.totalRevenue - (monthlyExpenses + monthlyEmployeeCosts)) / stats.totalRevenue * 100).toFixed(1)}% margin
                  </p>
                </div>
              </div>
            </div>

            {/* Expense Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Expense Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Employee Salaries</span>
                    <span className="text-sm font-semibold text-gray-800">{formatCurrency(monthlyEmployeeCosts)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">Operations</span>
                    <span className="text-sm font-semibold text-gray-800">{formatCurrency(monthlyExpenses)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center font-semibold">
                      <span className="text-gray-700">Total Expenses</span>
                      <span className="text-gray-800">{formatCurrency(monthlyExpenses + monthlyEmployeeCosts)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Recent Expenses</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {extraCosts.slice(0, 10).map((cost) => (
                    <div key={cost.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-700">{cost.name}</p>
                        <p className="text-xs text-gray-500">{cost.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-800">{formatCurrency(cost.amount)}</p>
                        <p className="text-xs text-gray-500">{new Date(cost.date).toLocaleDateString('id-ID')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}