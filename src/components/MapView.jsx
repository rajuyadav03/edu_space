import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from "../lib/constants";

// Component to handle map centering when listing is hovered
function MapController({ hoveredListing }) {
  const map = useMap();

  useEffect(() => {
    if (hoveredListing) {
      map.flyTo([hoveredListing.lat, hoveredListing.lng], 14, {
        duration: 0.8,
      });
    }
  }, [hoveredListing, map]);

  return null;
}

export default function MapView({ listings, hoveredListing }) {
  const mapRef = useRef();

  return (
    <MapContainer
      center={[DEFAULT_MAP_CENTER.lat, DEFAULT_MAP_CENTER.lng]}
      zoom={DEFAULT_MAP_ZOOM}
      className="h-full w-full"
      ref={mapRef}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />

      <MapController hoveredListing={hoveredListing} />

      {(listings || []).map((item) => (
        <Marker
          key={item._id || item.id}
          position={[item.lat || DEFAULT_MAP_CENTER.lat, item.lng || DEFAULT_MAP_CENTER.lng]}
        >
          <Popup>
            <div className="text-center">
              <strong className="block mb-1">{item.name || 'Unnamed Space'}</strong>
              <span className="text-sm text-gray-600">{item.location || 'Location unavailable'}</span>
              <div className="mt-2 font-semibold text-indigo-600">
                ₹{item.price || 0}/day
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
