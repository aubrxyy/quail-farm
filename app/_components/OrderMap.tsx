'use client';

import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';

type Order = {
  id: string;
  customerName: string;
  customerAddress: string;
  lat: number;
  lng: number;
  status: string;
  product: { name: string };
};

interface OrderMapProps {
  orders: Order[];
}

export default function OrderMap({ orders }: OrderMapProps) {
  const [LeafletMap, setLeafletMap] = useState<React.ReactElement | null>(null);

  useEffect(() => {
    // Only run on client
    (async () => {
      const L = (await import('leaflet')).default;
      
      // Fix marker icon
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const { MapContainer, TileLayer, Marker, Popup } = await import('react-leaflet');

      const center: [number, number] = orders.length
        ? [orders[0].lat, orders[0].lng]
        : [-6.2, 106.8];

      setLeafletMap(
        <MapContainer
          center={center}
          zoom={10}
          style={{ width: '100%', height: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {orders.map(order => (
            <Marker key={order.id} position={[order.lat, order.lng]}>
              <Popup>
                <strong>{order.product.name}</strong><br />
                {order.customerName}<br />
                {order.customerAddress}<br />
                Status: {order.status}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      );
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders]);

  return (
    <div style={{ width: '100%', height: '400px' }}>
      {LeafletMap || <div>Loading map...</div>}
    </div>
  );
}