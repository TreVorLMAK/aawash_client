import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";

export default function MapPicker({ onSelect }) {
  const [marker, setMarker] = useState(null);

  function LocationMarker() {
    useMapEvents({
      click(e) {
        const coords = [e.latlng.lat, e.latlng.lng];
        setMarker(coords);
        onSelect({
          type: "Point",
          coordinates: [e.latlng.lng, e.latlng.lat], // GeoJSON format
        });
      },
    });
    return marker ? <Marker position={marker} /> : null;
  }

  return (
    <MapContainer center={[27.7172, 85.324]} zoom={13} className="h-64 rounded-lg">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <LocationMarker />
    </MapContainer>
  );
}
