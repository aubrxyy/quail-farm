'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Product {
  id: number;
  name: string;
  gambar: string;
  harga: number;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Order {
  id: number;
  customerName: string;
  customerAddress: string;
  orderDate: string;
  orderType: string;
  orderAmount: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  product: Product;
  user: User;
}

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800'
};

const DATE_FILTERS = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'last-month', label: 'Last Month' }
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [selectedDateFilters, setSelectedDateFilters] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('search') || '';

  useEffect(() => {
    fetchOrders();
  }, [selectedDateFilters, typeFilter, statusFilter, searchTerm]);

  async function fetchOrders() {
    try {
      setLoading(true);
      if (searchTerm) setSearching(true);
      
      const params = new URLSearchParams();
      
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`/api/orders?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      let data = await response.json();

      // Apply client-side filters for date
      if (selectedDateFilters.length > 0) {
        const now = new Date();
        data = data.filter((order: Order) => {
          const orderDate = new Date(order.createdAt);
          
          return selectedDateFilters.some(filter => {
            switch (filter) {
              case 'today':
                return orderDate.toDateString() === now.toDateString();
              case 'yesterday':
                const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                return orderDate.toDateString() === yesterday.toDateString();
              case 'week':
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return orderDate >= weekAgo && orderDate <= now;
              case 'month':
                return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
              case 'last-month':
                const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
                return orderDate >= lastMonth && orderDate <= lastMonthEnd;
              default:
                return false;
            }
          });
        });
      }

      if (typeFilter !== 'all') {
        data = data.filter((order: Order) => order.orderType === typeFilter);
      }

      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }

  async function updateOrderStatus(orderId: number, newStatus: string) {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Refresh orders
      await fetchOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Failed to update order status');
    }
  }

  function toggleDateFilter(filterValue: string) {
    setSelectedDateFilters(prev => {
      if (prev.includes(filterValue)) {
        return prev.filter(f => f !== filterValue);
      } else {
        return [...prev, filterValue];
      }
    });
  }

  function resetAllFilters() {
    setSelectedDateFilters([]);
    setTypeFilter('all');
    setStatusFilter('all');
  }

  function hasActiveFilters() {
    return selectedDateFilters.length > 0 || typeFilter !== 'all' || statusFilter !== 'all' || searchTerm;
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  }

  if (loading) {
    return (
      <div className="p-6 max-w-full overflow-hidden">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-48"></div>
          <div className="h-16 bg-white rounded-lg"></div>
          <div className="h-64 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Orders Management</h1>
          {searchTerm && (
            <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
              {searching && (
                <svg className="animate-spin h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {orders.length === 0 
                ? `No orders found for "${searchTerm}"`
                : `Found ${orders.length} order${orders.length !== 1 ? 's' : ''} for "${searchTerm}"`
              }
            </p>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg p-6 mb-6 space-y-4 shadow max-w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="#2d2d2d" strokeWidth="2" />
              <rect x="10" y="7" width="4" height="2" fill="#2d2d2d" />
              <rect x="8" y="11" width="8" height="2" fill="#2d2d2d" />
              <rect x="11" y="15" width="2" height="2" fill="#2d2d2d" />
            </svg>
            <span className="font-medium">Filter By</span>
          </div>
          
          {hasActiveFilters() && (
            <button 
              onClick={resetAllFilters}
              className="flex items-center gap-2 text-red-600 font-medium hover:underline"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Reset All Filters
            </button>
          )}
        </div>

        {/* Date Filter Buttons */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Date Range (Select multiple)</label>
          <div className="flex flex-wrap gap-2">
            {DATE_FILTERS.map(dateOption => (
              <button
                key={dateOption.value}
                onClick={() => toggleDateFilter(dateOption.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedDateFilters.includes(dateOption.value)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {dateOption.label}
              </button>
            ))}
          </div>
          {selectedDateFilters.length > 0 && (
            <div className="text-xs text-gray-500">
              Selected: {selectedDateFilters.map(f => DATE_FILTERS.find(d => d.value === f)?.label).join(', ')}
            </div>
          )}
        </div>

        {/* Other Filters */}
        <div className="flex gap-4">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Order Type</label>
            <div className="space-y-3">
              <select 
                className="px-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="delivery">Delivery</option>
                <option value="pickup">Pickup</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Order Status</label>
            <div className="space-y-3">
              <select 
                className="px-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters() && (
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-sm text-blue-700">
              <span className="font-medium">Active filters:</span>
              <div className="mt-1 flex flex-wrap gap-2">
                {selectedDateFilters.map(filter => (
                  <span key={filter} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {DATE_FILTERS.find(d => d.value === filter)?.label}
                    <button 
                      onClick={() => toggleDateFilter(filter)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {typeFilter !== 'all' && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    Type: {typeFilter}
                    <button 
                      onClick={() => setTypeFilter('all')}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {statusFilter !== 'all' && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    Status: {statusFilter}
                    <button 
                      onClick={() => setStatusFilter('all')}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {searchTerm && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    Search: "{searchTerm}"
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table - Only this scrolls horizontally */}
      <div className="bg-white rounded-lg shadow overflow-hidden max-w-full">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.customerName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.user?.email}
                      </div>
                      <div className="text-xs text-gray-400">
                        {order.customerAddress.substring(0, 30)}...
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-16 w-16">
                        {order.product?.gambar ? (
                          <img 
                            className="h-16 w-16 rounded object-cover border" 
                            src={order.product.gambar} 
                            alt={order.product.name}
                          />
                        ) : (
                          <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-gray-400 text-xs">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {order.product?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatCurrency(order.product?.harga || 0)} each
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {order.orderType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.orderAmount} items
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(order.totalPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 ${STATUS_COLORS[order.status as keyof typeof STATUS_COLORS] || 'bg-gray-100 text-gray-800'}`}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {hasActiveFilters() ? 'No orders match your current filters.' : 'No orders found.'}
            </p>
            {hasActiveFilters() && (
              <button 
                onClick={resetAllFilters}
                className="inline-block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination info */}
      <div className="flex justify-between items-center mt-6 max-w-full">
        <div className="text-gray-500 text-sm">
          Showing {orders.length > 0 ? '1' : '0'}-{orders.length} of {orders.length}
          {hasActiveFilters() && ' (filtered)'}
        </div>
      </div>
    </div>
  );
}