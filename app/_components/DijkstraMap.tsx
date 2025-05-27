'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

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

interface DijkstraMapProps {
  orders: Order[];
  farmLocation: {
    lat: number;
    lng: number;
    address: string;
  };
}

function DijkstraMapComponent({ orders, farmLocation }: DijkstraMapProps) {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [routeCalculated, setRouteCalculated] = useState(false);
  const [totalDistance, setTotalDistance] = useState(0);
  const [routePolyline, setRoutePolyline] = useState<any>(null);
  const [orderMarkers, setOrderMarkers] = useState<any[]>([]);
  const [farmMarker, setFarmMarker] = useState<any>(null);
  const [L, setL] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load Leaflet dynamically
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
        setIsLoading(false);
      }
    };
    loadLeaflet();
  }, []);

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Calculate optimal route using nearest neighbor
  const calculateOptimalRoute = () => {
    if (selectedOrders.length === 0 || !L || !mapRef.current) return;
    const orderNodes = selectedOrders.map(orderId => {
      const order = orders.find(o => o.id === orderId)!;
      return {
        id: orderId,
        lat: order.lat,
        lng: order.lng,
        name: order.customerName,
      };
    });
    let currentLocation = { lat: farmLocation.lat, lng: farmLocation.lng };
    let totalDist = 0;
    const routePath: [number, number][] = [[farmLocation.lat, farmLocation.lng]];
    const unvisited = [...orderNodes];
    while (unvisited.length > 0) {
      let nearestNode: any = null;
      let nearestDistance = Infinity;
      let nearestIndex = -1;
      unvisited.forEach((node, index) => {
        const dist = calculateDistance(
          currentLocation.lat, currentLocation.lng,
          node.lat, node.lng
        );
        if (dist < nearestDistance) {
          nearestDistance = dist;
          nearestNode = node;
          nearestIndex = index;
        }
      });
      if (nearestNode && nearestIndex !== -1) {
        routePath.push([nearestNode.lat, nearestNode.lng]);
        totalDist += nearestDistance;
        currentLocation = { lat: nearestNode.lat, lng: nearestNode.lng };
        unvisited.splice(nearestIndex, 1);
      } else {
        break;
      }
    }
    // Return to farm
    const returnDistance = calculateDistance(
      currentLocation.lat, currentLocation.lng,
      farmLocation.lat, farmLocation.lng
    );
    routePath.push([farmLocation.lat, farmLocation.lng]);
    totalDist += returnDistance;
    setTotalDistance(totalDist);
    // Draw route on map
    if (routePolyline) {
      mapRef.current.removeLayer(routePolyline);
    }
    const polyline = L.polyline(routePath, {
      color: '#3B82F6',
      weight: 4,
      opacity: 0.8,
      dashArray: '10, 10'
    }).addTo(mapRef.current);
    setRoutePolyline(polyline);
    setRouteCalculated(true);
    mapRef.current.fitBounds(L.latLngBounds(routePath), { padding: [20, 20] });
  };

  // Clear route
  const clearRoute = () => {
    if (mapRef.current && routePolyline) {
      mapRef.current.removeLayer(routePolyline);
      setRoutePolyline(null);
      setRouteCalculated(false);
      setTotalDistance(0);
    }
  };

  // Toggle order selection
  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || !L || isLoading) return;
    mapRef.current = L.map(mapContainerRef.current).setView(
      [farmLocation.lat, farmLocation.lng],
      13
    );
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(mapRef.current);
    // Farm marker
    const farmIcon = L.divIcon({
      html: `<div style="background-color:#10B981;width:24px;height:24px;border-radius:50%;border:3px solid white;display:flex;align-items:center;justify-content:center;">🏠</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      className: 'custom-farm-marker'
    });
    const farmMarkerInstance = L.marker([farmLocation.lat, farmLocation.lng], { icon: farmIcon })
      .bindPopup(`<b>🐦 Quail Farm</b><br/>${farmLocation.address}`)
      .addTo(mapRef.current);
    setFarmMarker(farmMarkerInstance);
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [L, isLoading, farmLocation]);

  // Update markers when orders or selection changes
  useEffect(() => {
    if (!mapRef.current || !L || orders.length === 0) return;
    orderMarkers.forEach(marker => {
      try {
        mapRef.current?.removeLayer(marker);
      } catch {}
    });
    const validOrders = orders.filter(order =>
      order.lat !== farmLocation.lat || order.lng !== farmLocation.lng
    );
    const newMarkers = validOrders.map((order, index) => {
      const isSelected = selectedOrders.includes(order.id);
      const markerColor = isSelected ? '#3B82F6' : '#EF4444';
      const borderColor = isSelected ? '#1D4ED8' : '#DC2626';
      const orderIcon = L.divIcon({
        html: `<div style="background-color:${markerColor};width:20px;height:20px;border-radius:50%;border:2px solid ${borderColor};display:flex;align-items:center;justify-content:center;color:white;font-size:10px;font-weight:bold;">${index + 1}</div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        className: 'custom-order-marker'
      });
      const marker = L.marker([order.lat, order.lng], { icon: orderIcon })
        .bindPopup(`
          <div style="min-width:220px;font-family:system-ui;">
            <div style="font-weight:bold;font-size:14px;margin-bottom:8px;color:#1F2937;">📦 ${order.customerName}</div>
            <div style="color:#6B7280;margin-bottom:4px;"><strong>Product:</strong> ${order.product.name} × ${order.orderAmount}</div>
            <div style="color:#059669;font-weight:bold;margin-bottom:4px;"><strong>Value:</strong> Rp ${order.totalPrice.toLocaleString()}</div>
            <div style="color:${order.status === 'DELIVERED' ? '#059669' : order.status === 'PROCESSING' ? '#D97706' : '#3B82F6'};font-weight:bold;"><strong>Status:</strong> ${order.status}</div>
            <div style="margin-top:8px;padding-top:8px;border-top:1px solid #E5E7EB;color:#6B7280;font-size:12px;">📍 ${order.customerAddress}</div>
          </div>
        `)
        .addTo(mapRef.current!);
      marker.on('click', () => {
        toggleOrderSelection(order.id);
      });
      return marker;
    });
    setOrderMarkers(newMarkers);
    if (validOrders.length > 0) {
      const group = L.featureGroup([farmMarker, ...newMarkers].filter(Boolean));
      mapRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [orders, selectedOrders, L, farmMarker]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Delivery Route Optimization</h2>
        <div className="flex gap-2">
          <button
            onClick={calculateOptimalRoute}
            disabled={selectedOrders.length === 0}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedOrders.length === 0
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Calculate Route ({selectedOrders.length})
          </button>
          {routeCalculated && (
            <button
              onClick={clearRoute}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
            >
              Clear Route
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <div className="lg:col-span-2">
          <div ref={mapContainerRef} className="h-96 rounded-lg border border-gray-300 relative">
            {!L && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-gray-500">Loading map...</div>
              </div>
            )}
          </div>
          {routeCalculated && (
            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>🛣️ Total Distance:</strong> {totalDistance.toFixed(2)} km
              </p>
              <p className="text-sm text-blue-800">
                <strong>📦 Selected Orders:</strong> {selectedOrders.length}
              </p>
              <p className="text-sm text-blue-800">
                <strong>⏱️ Estimated Time:</strong> {Math.round(totalDistance * 2 + selectedOrders.length * 10)} minutes
              </p>
            </div>
          )}
        </div>
        {/* Order Selection */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">
            Select Orders ({selectedOrders.length} selected)
          </h3>
          <div className="space-y-2 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {orders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No orders available</p>
              </div>
            ) : (
              orders.map(order => (
                <div
                  key={order.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedOrders.includes(order.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => toggleOrderSelection(order.id)}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => toggleOrderSelection(order.id)}
                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{order.customerName}</div>
                      <div className="text-xs text-gray-500">{order.product.name}</div>
                      <div className="text-xs font-semibold text-gray-700">
                        {formatCurrency(order.totalPrice)}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                        order.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {selectedOrders.length > 0 && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-sm text-gray-700 mb-2">Route Summary</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>• Orders: {selectedOrders.length}</p>
                <p>• Total Value: {formatCurrency(
                  orders
                    .filter(order => selectedOrders.includes(order.id))
                    .reduce((sum, order) => sum + order.totalPrice, 0)
                )}</p>
                {routeCalculated && (
                  <>
                    <p>• Distance: {totalDistance.toFixed(2)} km</p>
                    <p>• Est. Time: {Math.round(totalDistance * 2 + selectedOrders.length * 10)} min</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
          <span>🏠 Farm</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
          <span>📦 Unselected Orders</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
          <span>📦 Selected Orders</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-1 bg-blue-500 mr-2" style={{borderStyle: 'dashed'}}></div>
          <span>🛣️ Calculated Route</span>
        </div>
      </div>
    </div>
  );
}

const DijkstraMap = dynamic(() => Promise.resolve(DijkstraMapComponent), {
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

export default DijkstraMap;