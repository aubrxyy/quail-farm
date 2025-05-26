'use client'

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface FinanceData {
  summary: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    totalOrders: number;
    activeEmployees: number;
  };
  revenue: {
    orders: any[];
    byDay: Record<string, number>;
  };
  expenses: {
    salaries: {
      total: number;
      employees: any[];
    };
    extraCosts: any[];
    byCategory: Record<string, number>;
  };
  period: {
    startDate: string | null;
    endDate: string | null;
    period: string;
  };
}

export default function FinancesPage() {
  const [financeData, setFinanceData] = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [showAddCost, setShowAddCost] = useState(false);
  const [newCost, setNewCost] = useState({
    name: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchFinanceData();
  }, [period]);

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/finances?period=${period}`);
      if (response.ok) {
        const data = await response.json();
        setFinanceData(data);
      }
    } catch (error) {
      console.error('Error fetching finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/extra-costs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newCost,
          amount: parseInt(newCost.amount),
        }),
      });

      if (response.ok) {
        setShowAddCost(false);
        setNewCost({ name: '', amount: '', category: '', date: new Date().toISOString().split('T')[0] });
        fetchFinanceData(); // Refresh data
      }
    } catch (error) {
      console.error('Error adding extra cost:', error);
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
    if (!financeData) return 'text-gray-600';
    return financeData.summary.netProfit >= 0 ? 'text-green-600' : 'text-red-600';
  }, [financeData]);

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

  if (!financeData) {
    return (
      <div className="flex text-black bg-bright-egg-white min-h-screen">
        <div className="px-8 pt-24 flex flex-col gap-y-6 w-full">
          <div className="text-center py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Unable to load financial data</h1>
            <button 
              onClick={fetchFinanceData}
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
          <h1 className="text-3xl font-bold text-gray-800">Financial Overview</h1>
          <div className="flex gap-4 items-center">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="border border-gray-300 rounded-md p-2 bg-white text-sm"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
            <button
              onClick={() => setShowAddCost(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Cost
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <div className='h-24 bg-white rounded-xl flex justify-between p-4'>
            <div className='text-lg flex flex-col justify-start text-left'>
              <span className='font-medium text-gray-600'>Total Revenue</span>
              <span className='font-semibold text-xl text-green-600'>{formatCurrency(financeData.summary.totalRevenue)}</span>
            </div>
            <div className="flex items-center">
              <Image src="/totalsales.svg" alt="revenue" width={50} height={50}/>
            </div>
          </div>

          <div className='h-24 bg-white rounded-xl flex justify-between p-4'>
            <div className='text-lg flex flex-col justify-start text-left'>
              <span className='font-medium text-gray-600'>Total Expenses</span>
              <span className='font-semibold text-xl text-red-600'>{formatCurrency(financeData.summary.totalExpenses)}</span>
            </div>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className='h-24 bg-white rounded-xl flex justify-between p-4'>
            <div className='text-lg flex flex-col justify-start text-left'>
              <span className='font-medium text-gray-600'>Net Profit</span>
              <span className={`font-semibold text-xl ${profitColor}`}>
                {formatCurrency(financeData.summary.netProfit)}
              </span>
            </div>
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                financeData.summary.netProfit >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <svg className={`w-6 h-6 ${profitColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {financeData.summary.netProfit >= 0 ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                  )}
                </svg>
              </div>
            </div>
          </div>

          <div className='h-24 bg-white rounded-xl flex justify-between p-4'>
            <div className='text-lg flex flex-col justify-start text-left'>
              <span className='font-medium text-gray-600'>Total Orders</span>
              <span className='font-semibold text-2xl text-blue-600'>{financeData.summary.totalOrders}</span>
            </div>
            <div className="flex items-center">
              <Image src="/totalorders.svg" alt="orders" width={50} height={50}/>
            </div>
          </div>
        </div>

        {/* Revenue and Expenses Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Orders</h2>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {financeData.revenue.orders.slice(0, 10).map((order: any) => (
                <div key={order.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{order.customerName}</div>
                    <div className="text-sm text-gray-500">{order.product.name}</div>
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
              ))}
            </div>
          </div>

          {/* Expenses Breakdown */}
          <div className="bg-white rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Expenses Breakdown</h2>
            <div className="space-y-4">
              {/* Salary Costs */}
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">Employee Salaries</div>
                  <div className="text-sm text-gray-500">{financeData.summary.activeEmployees} active employees</div>
                </div>
                <div className="font-semibold text-red-600">{formatCurrency(financeData.expenses.salaries.total)}</div>
              </div>

              {/* Extra Costs by Category */}
              {Object.entries(financeData.expenses.byCategory).map(([category, amount]: [string, any]) => (
                category !== 'salaries' && (
                  <div key={category} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="capitalize font-medium">{category}</div>
                    <div className="font-semibold text-red-600">{formatCurrency(amount)}</div>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>

        {/* Extra Costs List */}
        <div className="bg-white rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Extra Costs</h2>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {financeData.expenses.extraCosts.map((cost: any) => (
              <div key={cost.id} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg">
                <div>
                  <div className="font-medium">{cost.name}</div>
                  <div className="text-sm text-gray-500">{cost.category}</div>
                  <div className="text-xs text-gray-400">{formatDate(cost.date)}</div>
                </div>
                <div className="font-semibold text-red-600">{formatCurrency(cost.amount)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/employees" className="bg-purple-600 text-white p-4 rounded-xl hover:bg-purple-700 transition-colors text-center">
            <div className="flex flex-col items-center gap-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span className="font-medium">Manage Employees</span>
              <span className="text-sm">({financeData.summary.activeEmployees} active)</span>
            </div>
          </Link>
          
          <Link href="/admin/orders" className="bg-green-600 text-white p-4 rounded-xl hover:bg-green-700 transition-colors text-center">
            <div className="flex flex-col items-center gap-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
              <span className="font-medium">View Orders</span>
              <span className="text-sm">({financeData.summary.totalOrders} this period)</span>
            </div>
          </Link>
          
          <button 
            onClick={() => setShowAddCost(true)}
            className="bg-red-600 text-white p-4 rounded-xl hover:bg-red-700 transition-colors text-center"
          >
            <div className="flex flex-col items-center gap-2">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
              <span className="font-medium">Add Extra Cost</span>
              <span className="text-sm">Record new expense</span>
            </div>
          </button>
        </div>
      </div>

      {/* Add Cost Modal */}
      {showAddCost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4">Add Extra Cost</h3>
            <form onSubmit={handleAddCost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cost Name</label>
                <input
                  type="text"
                  value={newCost.name}
                  onChange={(e) => setNewCost({ ...newCost, name: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Feed Purchase"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (IDR)</label>
                <input
                  type="number"
                  value={newCost.amount}
                  onChange={(e) => setNewCost({ ...newCost, amount: e.target.value })}
                  required
                  min="1"
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="500000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newCost.category}
                  onChange={(e) => setNewCost({ ...newCost, category: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category</option>
                  <option value="feed">Feed</option>
                  <option value="equipment">Equipment</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="utilities">Utilities</option>
                  <option value="transport">Transport</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={newCost.date}
                  onChange={(e) => setNewCost({ ...newCost, date: e.target.value })}
                  className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Cost
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCost(false)}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}