'use client'

import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import { LatLngExpression } from 'leaflet';
import L from 'leaflet';

const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

type Order = {
  id: string;
  address: string;
  lat: number;
  lng: number;
  customerName: string;
  products: string[];
  status: string;
  date: string;
};

const farmLocation: LatLngExpression = [-6.605873355505011, 106.85175913462683];

const completedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const processingIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const OrderMap = ({ orders }: { orders: Order[] }) => {
  const center: LatLngExpression = [orders[0]?.lat ?? -6.2, orders[0]?.lng ?? 106.8];

  return (
    <MapContainer center={center} zoom={11} style={{ height: '450px', width: '100%' }}>
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {orders.map((order) => {
        const icon =
          order.status && order.status.toLowerCase() === 'completed'
            ? completedIcon
            : processingIcon;
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${farmLocation[0]},${farmLocation[1]}&destination=${order.lat},${order.lng}&travelmode=driving`;
        return (
          <Marker key={order.id} position={[order.lat, order.lng]} icon={icon}>
            <Popup>
              <div className="leading-none text-sm">
                <p><span className="font-semibold">Order ID:</span> {order.id}</p>
                <p><span className="font-semibold">Customer:</span> {order.customerName || 'N/A'}</p>
                <p><span className="font-semibold">Address:</span> {order.address}</p>
                <p><span className="font-semibold">Products:</span> {order.products.length > 0 ? order.products.join(', ') : 'N/A'}</p>
                <p><span className="font-semibold">Status:</span> {order.status}</p>
                <p><span className="font-semibold">Date:</span> {order.date}</p>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow transition !important"
                >
                  
                  Route ke alamat {'>'}
                </a>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default OrderMap;