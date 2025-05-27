'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

interface Order {
  id: string;
  customerName: string;
  customerAddress: string;
  address: {
    latitude: number;
    longitude: number;
  };
  status: string;
  product: { name: string };
  totalPrice: number;
  orderAmount: number;
}

interface OrderMapProps {
  orders: Order[];
  farmLocation: {
    lat: number;
    lng: number;
    address: string;
  };
}

interface RouteInfo {
  distance: number;
  duration: number;
  coordinates?: [number, number][];
}

function OrderMapComponent({ orders, farmLocation }: OrderMapProps) {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [L, setL] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [routePolyline, setRoutePolyline] = useState<any>(null);
  const [calculatingRoute, setCalculatingRoute] = useState(false);

  // ✅ STATIC ORDERS - Hardcoded for testing
  const staticOrders: Order[] = [
    {
      id: "1",
      customerName: "Budi Santoso",
      customerAddress: "Citeureup, Bogor",
      address: {
        latitude: -6.588507138213584,
        longitude: 106.80419106977531
      },
      status: "DELIVERED",
      product: { name: "Quail Eggs" },
      totalPrice: 25000,
      orderAmount: 5
    },
    {
      id: "2", 
      customerName: "Siti Rahayu",
      customerAddress: "Sentul, Bogor",
      address: {
        latitude: -6.563598,
        longitude: 106.938477
      },
      status: "PROCESSING",
      product: { name: "Fresh Quail Meat" },
      totalPrice: 45000,
      orderAmount: 3
    },
    {
      id: "3",
      customerName: "Ahmad Wijaya", 
      customerAddress: "Cibinong, Bogor",
      address: {
        latitude: -6.4817442,
        longitude: 106.8548707
      },
      status: "PENDING",
      product: { name: "Quail Eggs" },
      totalPrice: 30000,
      orderAmount: 6
    },
    {
      id: "4",
      customerName: "Maya Kusuma",
      customerAddress: "Depok",
      address: {
        latitude: -6.4058172,
        longitude: 106.8194103
      },
      status: "DELIVERED",
      product: { name: "Organic Quail Eggs" },
      totalPrice: 35000,
      orderAmount: 7
    },
    {
      id: "5",
      customerName: "Joko Susilo",
      customerAddress: "Cileungsi, Bogor", 
      address: {
        latitude: -6.3947,
        longitude: 106.9597
      },
      status: "PROCESSING",
      product: { name: "Quail Meat Package" },
      totalPrice: 55000,
      orderAmount: 4
    }
  ];

  // Use static orders instead of props
  const displayOrders = staticOrders;

  // Load Leaflet
  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        const leaflet = await import('leaflet');
        if (typeof window !== 'undefined') {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }
        const L = leaflet.default || leaflet;
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
        setL(L);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading Leaflet:', error);
        setIsLoading(false);
      }
    };
    loadLeaflet();
  }, []);

  // Calculate route - fallback to straight line if API fails
  const calculateRoute = async (order: Order) => {
  console.log('Calculating route for order:', order.id);
  
  setCalculatingRoute(true);
  try {
    // Fix the API path
    const response = await fetch('/api/route/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        farmLat: farmLocation.lat,
        farmLng: farmLocation.lng,
        customerLat: order.address.latitude,
        customerLng: order.address.longitude
      })
    });

    if (response.ok) {
      const route = await response.json();
      console.log('✅ Route calculated:', route);
      
      setRouteInfo(route);
      
      // Draw route on map
      if (mapRef.current && L && route.coordinates) {
        // Clear existing route
        if (routePolyline) {
          mapRef.current.removeLayer(routePolyline);
        }
        
        // Convert coordinates to Leaflet format [lat, lng]
        const latLngCoords = route.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]);
        
        const polyline = L.polyline(latLngCoords, {
          color: '#3B82F6',
          weight: 4,
          opacity: 0.8,
          // Show solid line since we're getting proper routing now
        }).addTo(mapRef.current);
        
        setRoutePolyline(polyline);
        
        // Fit map to show the route
        mapRef.current.fitBounds(polyline.getBounds(), { padding: [20, 20] });
      }
    } else {
      console.error('Route API failed');
    }
  } catch (error) {
    console.error('Error calculating route:', error);
  } finally {
    setCalculatingRoute(false);
  }
};

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || !L || isLoading) return;
    
    console.log('🗺️ Initializing map');
    
    mapRef.current = L.map(mapContainerRef.current).setView(
      [farmLocation.lat, farmLocation.lng],
      11
    );
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapRef.current);

    // Farm marker
    const farmIcon = L.divIcon({
      html: `<div style="background-color:#10B981;width:30px;height:30px;border-radius:50%;border:3px solid white;display:flex;align-items:center;justify-content:center;font-size:16px;">🏠</div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
    
    L.marker([farmLocation.lat, farmLocation.lng], { icon: farmIcon })
      .bindPopup(`<b>🐦 Quail Farm</b><br/>${farmLocation.address}`)
      .addTo(mapRef.current);

    console.log('✅ Map initialized');

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [L, isLoading, farmLocation]);

  // Add order markers
  useEffect(() => {
    if (!mapRef.current || !L) return;
    
    console.log('📍 Adding markers for', displayOrders.length, 'orders');

    const markers: any[] = [];

    displayOrders.forEach((order, index) => {
      const isSelected = selectedOrder?.id === order.id;
      const orderIcon = L.divIcon({
        html: `<div style="background-color:${isSelected ? '#3B82F6' : '#EF4444'};width:25px;height:25px;border-radius:50%;border:2px solid white;display:flex;align-items:center;justify-content:center;color:white;font-size:12px;font-weight:bold;">${index + 1}</div>`,
        iconSize: [25, 25],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([order.address.latitude, order.address.longitude], { icon: orderIcon })
        .bindPopup(`
          <div style="min-width:200px;">
            <h3 style="margin:0 0 8px 0;font-weight:bold;">${order.customerName}</h3>
            <p style="margin:0 0 4px 0;"><strong>Product:</strong> ${order.product.name}</p>
            <p style="margin:0 0 4px 0;"><strong>Amount:</strong> ${order.orderAmount}</p>
            <p style="margin:0 0 4px 0;"><strong>Total:</strong> Rp ${order.totalPrice.toLocaleString()}</p>
            <p style="margin:0 0 4px 0;"><strong>Status:</strong> ${order.status}</p>
            <p style="margin:0;color:#666;font-size:12px;">${order.customerAddress}</p>
            <button onclick="window.calculateRouteForOrder('${order.id}')" style="background:#3B82F6;color:white;border:none;padding:4px 8px;border-radius:4px;margin-top:8px;cursor:pointer;">Calculate Route</button>
          </div>
        `)
        .addTo(mapRef.current);

      marker.on('click', () => {
        console.log('🔍 Marker clicked:', order.customerName);
        setSelectedOrder(order);
        calculateRoute(order);
      });

      markers.push(marker);
    });

    // Add global function for popup button
    (window as any).calculateRouteForOrder = (orderId: string) => {
      const order = displayOrders.find(o => o.id === orderId);
      if (order) {
        setSelectedOrder(order);
        calculateRoute(order);
      }
    };

    // Fit map to show all markers
    if (displayOrders.length > 0) {
      const allLatLngs = [
        [farmLocation.lat, farmLocation.lng],
        ...displayOrders.map(order => [order.address.latitude, order.address.longitude])
      ];
      const bounds = L.latLngBounds(allLatLngs);
      mapRef.current.fitBounds(bounds, { padding: [20, 20] });
    }

    console.log('✅ Added', markers.length, 'markers');

    return () => {
      markers.forEach(marker => {
        if (mapRef.current) {
          mapRef.current.removeLayer(marker);
        }
      });
    };
  }, [L, selectedOrder, displayOrders]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-64 mb-4"></div>
          <div className="h-96 bg-gray-300 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">🗺️ Order Locations & Real Road Routes</h2>
      
      {/* Info Panel */}
      <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-blue-800 font-medium">📦 Showing {displayOrders.length} orders with coordinates</p>
        <p className="text-blue-600 text-sm mt-1">Click any order marker to calculate the delivery route!</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <div className="lg:col-span-2">
          <div ref={mapContainerRef} className="h-96 rounded-lg border border-gray-300" />
          
          {calculatingRoute && (
            <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
              🔄 Calculating optimal route...
            </div>
          )}
        </div>
        
        {/* Order Info */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">
            Orders ({displayOrders.length})
          </h3>
          
          {selectedOrder && routeInfo && (
            <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">🛣️ Route to {selectedOrder.customerName}</h4>
              <div className="text-sm text-green-700 space-y-1">
                <p>📏 Distance: {routeInfo.distance.toFixed(2)} km</p>
                <p>⏱️ Duration: {Math.round(routeInfo.duration)} minutes</p>
                <p>💰 Order Value: Rp {selectedOrder.totalPrice.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-2">
                  {routeInfo.coordinates && routeInfo.coordinates.length > 2 ? 
                    '✅ Real road routing' : 
                    '📏 Direct distance (API unavailable)'
                  }
                </p>
              </div>
            </div>
          )}
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {displayOrders.map((order, index) => (
              <div 
                key={order.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedOrder?.id === order.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => {
                  setSelectedOrder(order);
                  calculateRoute(order);
                }}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 ${
                    selectedOrder?.id === order.id ? 'bg-blue-500' : 'bg-red-500'
                  } text-white rounded-full flex items-center justify-center text-xs font-bold mr-3`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{order.customerName}</div>
                    <div className="text-xs text-gray-500">{order.product.name}</div>
                    <div className="text-xs font-semibold text-gray-700">
                      Rp {order.totalPrice.toLocaleString()}
                    </div>
                    <div className="text-xs text-green-600">
                      📍 {order.address.latitude.toFixed(4)}, {order.address.longitude.toFixed(4)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex gap-4 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
          <span>🏠 Farm</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
          <span>📦 Orders</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
          <span>📦 Selected Order</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-1 bg-blue-500 mr-2"></div>
          <span>🛣️ Road Route</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-1 bg-blue-500 mr-2" style={{borderStyle: 'dashed'}}></div>
          <span>📏 Direct Route</span>
        </div>
      </div>
    </div>
  );
}

const OrderMap = dynamic(() => Promise.resolve(OrderMapComponent), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-64 mb-4"></div>
        <div className="h-96 bg-gray-300 rounded-lg"></div>
      </div>
    </div>
  )
});

export default OrderMap;