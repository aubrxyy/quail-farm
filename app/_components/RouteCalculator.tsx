'use client';

import { useState } from 'react';

interface Order {
  id: string;
  customerName: string;
  customerAddress: string;
  lat: number;
  lng: number;
  status: string;
  product: { name: string };
  totalPrice: number;
  orderAmount: number;
}

interface RouteCalculatorProps {
  userAddress?: {
    lat: number;
    lng: number;
    address: string;
  };
  orders: Order[];
}

export default function RouteCalculator({ userAddress, orders }: RouteCalculatorProps) {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const calculateRoute = () => {
    if (selectedOrders.length === 0) {
      alert('Please select at least one order for route calculation');
      return;
    }
    
    // Placeholder for route calculation logic
    alert(`Route calculated for ${selectedOrders.length} orders`);
  };

  const totalValue = orders
    .filter(order => selectedOrders.includes(order.id))
    .reduce((sum, order) => sum + order.totalPrice, 0);

  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Route Calculator</h2>
        <button
          onClick={calculateRoute}
          disabled={selectedOrders.length === 0}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedOrders.length === 0
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Calculate Route
        </button>
      </div>

      {userAddress && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-800 text-sm mb-1">Starting Point</h3>
          <p className="text-sm text-green-700">{userAddress.address}</p>
        </div>
      )}

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Select Orders ({selectedOrders.length} selected)
          </span>
          {selectedOrders.length > 0 && (
            <span className="text-sm font-semibold text-blue-600">
              Total: {formatCurrency(totalValue)}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No orders available</p>
          </div>
        ) : (
          orders.map((order) => (
            <div 
              key={order.id}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedOrders.includes(order.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => toggleOrderSelection(order.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => toggleOrderSelection(order.id)}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div>
                    <div className="font-medium text-sm">{order.customerName}</div>
                    <div className="text-xs text-gray-500 truncate max-w-40">
                      {order.customerAddress}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-sm">{formatCurrency(order.totalPrice)}</div>
                  <div className="text-xs text-gray-500">{order.product.name}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedOrders.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 text-sm mb-2">Route Summary</h3>
          <div className="text-sm text-gray-600">
            <p>• {selectedOrders.length} stops selected</p>
            <p>• Total value: {formatCurrency(totalValue)}</p>
            <p>• Estimated time: {selectedOrders.length * 15} minutes</p>
          </div>
        </div>
      )}
    </div>
  );
}