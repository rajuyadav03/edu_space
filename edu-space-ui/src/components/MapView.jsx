import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

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
      center={[19.076, 72.8777]}
      zoom={11}
      className="h-full w-full"
      ref={mapRef}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />

      <MapController hoveredListing={hoveredListing} />

      {listings.map((item) => (
        <Marker 
          key={item.id} 
          position={[item.lat, item.lng]}
        >
          <Popup>
            <div className="text-center">
              <strong className="block mb-1">{item.name}</strong>
              <span className="text-sm text-gray-600">{item.location}</span>
              <div className="mt-2 font-semibold text-indigo-600">
                ₹{item.price}/day
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
