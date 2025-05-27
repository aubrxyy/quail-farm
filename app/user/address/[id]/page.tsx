"use client";
import Header from "@/app/_components/Header";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMapEvents } from "react-leaflet";

// JABODETABEK bounds
const JABODETABEK_BOUNDS = {
  north: -5.8,
  south: -6.9,
  west: 106.3,
  east: 107.1,
};

const clampToBounds = (lat: number, lng: number) => {
  const clampedLat = Math.max(JABODETABEK_BOUNDS.south, Math.min(JABODETABEK_BOUNDS.north, lat));
  const clampedLng = Math.max(JABODETABEK_BOUNDS.west, Math.min(JABODETABEK_BOUNDS.east, lng));
  return [clampedLat, clampedLng];
};

// Rectangles to gray out outside Jabodetabek
const outsideBounds: [number, number][][] = [
  [[-90, -180], [90, 106.3]],
  [[-90, 107.1], [90, 180]],
  [[-90, 106.3], [-6.9, 107.1]],
  [[-5.8, 106.3], [90, 107.1]]
];

const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });
const Rectangle = dynamic(() => import("react-leaflet").then(mod => mod.Rectangle), { ssr: false });
const FeatureGroup = dynamic(() => import("react-leaflet").then(mod => mod.FeatureGroup), { ssr: false });

export default function EditAddressPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [label, setLabel] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");
  const [country, setCountry] = useState("Indonesia");
  const [postalCode, setPostalCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  useEffect(() => {
    import("leaflet").then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    });
  }, []);

  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=id`);
      const data = await res.json();
      setAddress(data.display_name || "");
      setCity(data.address.city || data.address.town || data.address.village || "");
      setDistrict(data.address.suburb || data.address.county || "");
      setProvince(data.address.state || data.address.region || "");
      setPostalCode(data.address.postcode || "");
      setCountry(data.address.country || "Indonesia");
    } catch {
      // silently fail reverse geocode
    }
  };

  useEffect(() => {
    if (searchTerm.length < 3) return;
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchTerm}&countrycodes=id&accept-language=id`);
        const data = await res.json();
        setSuggestions(data);
      } catch {
        setSuggestions([]);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    if (id) {
      fetch(`/api/addresses/${id}`)
        .then(res => res.json())
        .then(address => {
          setLabel(address.label || "");
          setAddress(address.address || "");
          setCity(address.city || "");
          setDistrict(address.district || "");
          setProvince(address.province || "");
          setCountry(address.country || "Indonesia");
          setPostalCode(address.postalCode || "");
          setLatitude(address.latitude || null);
          setLongitude(address.longitude || null);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  function LocationMarker({ setLatitude, setLongitude }: {
    setLatitude: (lat: number) => void;
    setLongitude: (lng: number) => void;
  }) {
    useMapEvents({
      click(e) {
        const [lat, lng] = clampToBounds(e.latlng.lat, e.latlng.lng);
        setLatitude(lat);
        setLongitude(lng);
        reverseGeocode(lat, lng);
      },
    });
    return null;
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const res = await fetch(`/api/addresses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label, address, city, district, province, country, postalCode, latitude, longitude }),
    });

    if (res.ok) {
  router.push("/user/address?edited=true");
    } else {
      const result = await res.json();
      setError(result.error || "Gagal mengubah alamat.");
      setSubmitting(false);
    }
  };

  if (!id) {
    return (
      <>
        <Header />
        <div className='bg-[#F7F4E8] min-h-screen pt-28'>
          <div className="max-w-2xl mx-auto px-6 py-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-[#6B3C10] mb-2">ID Alamat Tidak Valid</h1>
              <p className="text-gray-600 mb-6">Alamat yang Anda cari tidak ditemukan.</p>
              <Link href="/user/address">
                <button className="bg-[#ED9C40] text-white px-6 py-2 rounded-lg hover:bg-[#EDC043] transition-colors duration-200">
                  Kembali ke Daftar Alamat
                </button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className='bg-[#F7F4E8] min-h-screen pt-28'>
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
                <div className="bg-[#E6DCB8] animate-pulse"></div>
                <div className="p-8">
                  <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-[#E6DCB8] rounded w-1/3"></div>
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i}>
                          <div className="h-4 bg-[#E6DCB8] rounded w-1/4 mb-2"></div>
                          <div className="h-10 bg-[#E6DCB8] rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className='bg-[#F7F4E8] min-h-screen pt-28'>
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link 
              href="/user/address" 
              className="inline-flex items-center text-[#6B3C10] hover:text-[#ED9C40] transition-colors duration-200 font-medium"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Kembali ke Daftar Alamat
            </Link>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#EDC043] to-[#ED9C40] px-8 py-6">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-transparent rounded-lg flex items-center justify-center mr-4">
                  <svg className="size-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Edit Alamat</h1>
                  <p className="text-white text-opacity-90">Perbarui informasi alamat pengiriman Anda</p>
                </div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
              {/* Left Column - Map */}
              <div className="relative">
                <MapContainer
                  center={latitude && longitude ? [latitude, longitude] : [-6.2, 106.8]}
                  zoom={13}
                  scrollWheelZoom={true}
                  className="h-full w-full"
                  style={{ height: "100%", width: "100%" }}
                  maxBounds={[[-6.9, 106.3], [-5.8, 107.1]]}
                  maxBoundsViscosity={1.0}
                >
                  <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <FeatureGroup>
                    {outsideBounds.map((bounds, i) => (
                      <Rectangle
                        key={i}
                        bounds={bounds}
                        pathOptions={{ fillColor: "gray", fillOpacity: 0.4, weight: 0 }}
                      />
                    ))}
                  </FeatureGroup>
                  {latitude && longitude && (
                    <Marker position={[latitude, longitude]}>
                      <Popup>Lokasi yang dipilih</Popup>
                    </Marker>
                  )}
                  <LocationMarker setLatitude={setLatitude} setLongitude={setLongitude} />
                </MapContainer>
              </div>

              {/* Right Column - Form */}
              <div className="p-8">
                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Search Location */}
                  <div>
                    <label className="block text-sm font-semibold text-[#6B3C10] mb-2">
                      Cari Lokasi
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 pr-10 border-2 border-[#E6DCB8] rounded-lg focus:ring-2 focus:ring-[#EDC043] focus:border-[#EDC043] transition-all duration-200 text-[#6B3C10] text-base font-medium placeholder-gray-500"
                        placeholder="Cari alamat atau lokasi..."
                      />
                      <svg className="absolute right-3 top-4 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      
                      {suggestions.length > 0 && (
                        <ul className="absolute top-full left-0 right-0 bg-white border border-[#E6DCB8] rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg z-20">
                          {suggestions.map((item) => {
                            const [clampedLat, clampedLng] = clampToBounds(parseFloat(item.lat), parseFloat(item.lon));
                            return (
                              <li
                                key={item.place_id}
                                onClick={() => {
                                  setAddress(item.display_name);
                                  setLatitude(clampedLat);
                                  setLongitude(clampedLng);
                                  reverseGeocode(clampedLat, clampedLng);
                                  setSearchTerm(item.display_name);
                                  setSuggestions([]);
                                }}
                                className="p-3 hover:bg-[#F7F4E8] cursor-pointer text-sm text-[#6B3C10] border-b border-[#E6DCB8] last:border-b-0"
                              >
                                {item.display_name}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Ketik minimal 3 karakter untuk mencari lokasi</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#6B3C10] mb-2">
                      Label Alamat
                    </label>
                    <input
                      type="text"
                      value={label}
                      onChange={e => setLabel(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-[#E6DCB8] rounded-lg focus:ring-2 focus:ring-[#EDC043] focus:border-[#EDC043] transition-all duration-200 text-[#6B3C10] text-base font-medium placeholder-gray-500"
                      placeholder="Rumah, Kantor, dll."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#6B3C10] mb-2">
                      Alamat Lengkap *
                    </label>
                    <textarea
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      required
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-[#E6DCB8] rounded-lg focus:ring-2 focus:ring-[#EDC043] focus:border-[#EDC043] transition-all duration-200 text-[#6B3C10] text-base font-medium placeholder-gray-500"
                      placeholder="Masukkan alamat lengkap Anda"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#6B3C10] mb-2">
                        Kecamatan *
                      </label>
                      <input
                        type="text"
                        value={district}
                        onChange={e => setDistrict(e.target.value)}
                        required
                        className="w-full px-4 py-3 border-2 border-[#E6DCB8] rounded-lg focus:ring-2 focus:ring-[#EDC043] focus:border-[#EDC043] transition-all duration-200 text-[#6B3C10] text-base font-medium placeholder-gray-500"
                        placeholder="Masukkan kecamatan"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#6B3C10] mb-2">
                        Kota/Kabupaten *
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        required
                        className="w-full px-4 py-3 border-2 border-[#E6DCB8] rounded-lg focus:ring-2 focus:ring-[#EDC043] focus:border-[#EDC043] transition-all duration-200 text-[#6B3C10] text-base font-medium placeholder-gray-500"
                        placeholder="Masukkan kota"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#6B3C10] mb-2">
                        Provinsi *
                      </label>
                      <input
                        type="text"
                        value={province}
                        onChange={e => setProvince(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-[#E6DCB8] rounded-lg focus:ring-2 focus:ring-[#EDC043] focus:border-[#EDC043] transition-all duration-200 text-[#6B3C10] text-base font-medium placeholder-gray-500"
                        placeholder="Masukkan provinsi"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#6B3C10] mb-2">
                        Kode Pos *
                      </label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={e => setPostalCode(e.target.value)}
                        required
                        className="w-full px-4 py-3 border-2 border-[#E6DCB8] rounded-lg focus:ring-2 focus:ring-[#EDC043] focus:border-[#EDC043] transition-all duration-200 text-[#6B3C10] text-base font-medium placeholder-gray-500"
                        placeholder="12345"
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-[#E6DCB8]">
                    <button
                      type="button"
                      onClick={() => router.push('/user/address')}
                      className="flex-1 px-6 py-3 border-2 border-[#E6DCB8] text-[#6B3C10] rounded-lg hover:bg-[#F7F4E8] transition-colors duration-200 font-medium"
                      disabled={submitting}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-gradient-to-r from-[#EDC043] to-[#ED9C40] text-white px-6 py-3 rounded-lg hover:from-[#ED9C40] hover:to-[#EDC043] transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {submitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Simpan Perubahan
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}