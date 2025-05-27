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

interface OrderMapProps {
  orders: Order[];
}

export default function OrderMap({ orders }: OrderMapProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'pending': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Order Locations</h2>
        <div className="text-sm text-gray-500">
          {orders.length} orders
        </div>
      </div>
      
      {/* Simple list view instead of map for now */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No orders to display</p>
          </div>
        ) : (
          orders.map((order) => (
            <div 
              key={order.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                selectedOrder?.id === order.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{order.customerName}</h3>
                  <p className="text-sm text-gray-600 mb-2">{order.customerAddress}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span><strong>Product:</strong> {order.product.name}</span>
                    <span><strong>Amount:</strong> {order.orderAmount}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-800 mb-1">
                    {formatCurrency(order.totalPrice)}
                  </div>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedOrder && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">Selected Order Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Customer:</strong> {selectedOrder.customerName}</p>
              <p><strong>Product:</strong> {selectedOrder.product.name}</p>
            </div>
            <div>
              <p><strong>Amount:</strong> {selectedOrder.orderAmount}</p>
              <p><strong>Total:</strong> {formatCurrency(selectedOrder.totalPrice)}</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">{selectedOrder.customerAddress}</p>
        </div>
      )}
    </div>
  );
}