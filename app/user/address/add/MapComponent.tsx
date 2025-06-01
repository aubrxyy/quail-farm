"use client";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default icons
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

interface LocationMarkerProps {
  setLatitude: (lat: number) => void;
  setLongitude: (lng: number) => void;
}

function LocationMarker({ setLatitude, setLongitude }: LocationMarkerProps) {
  useMapEvents({
    click(e) {
      setLatitude(e.latlng.lat);
      setLongitude(e.latlng.lng);
    },
  });
  return null;
}

interface MapComponentProps {
  latitude: number | null;
  longitude: number | null;
  setLatitude: (lat: number) => void;
  setLongitude: (lng: number) => void;
}

export default function MapComponent({ 
  latitude, 
  longitude, 
  setLatitude, 
  setLongitude 
}: MapComponentProps) {
  return (
    <div className="h-64 mb-6">
      <MapContainer
        center={[-6.2, 106.8]}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full rounded"
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {latitude && longitude && (
          <Marker position={[latitude, longitude]}>
            <Popup>Lokasi yang dipilih</Popup>
          </Marker>
        )}
        <LocationMarker setLatitude={setLatitude} setLongitude={setLongitude} />
      </MapContainer>
    </div>
  );
}