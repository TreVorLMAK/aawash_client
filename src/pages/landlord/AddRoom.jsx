import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../utils/api";
import { UploadCloud, CheckSquare, MapPin, XCircle } from "lucide-react";
import Navbar from "../../components/Navbar";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

function LocationSelector({ onSelectLocation, cities }) {
  const [markerPos, setMarkerPos] = useState(null);

  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setMarkerPos([lat, lng]);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      const city =
        data?.address?.city ||
        data?.address?.town ||
        data?.address?.village ||
        data?.address?.state ||
        "Unknown";
      const address = data?.display_name || "Unknown";
      onSelectLocation({
        geo: { type: "Point", coordinates: [lng, lat] },
        city,
        address,
      });
    },
  });

  return markerPos ? <Marker position={markerPos} /> : null;
}

export default function AddRoom() {
  const [roomData, setRoomData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    amenities: [],
  });
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState(null);
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await fetch("/nepali-cities.json");
        const data = await res.json();
        setCities(data);
      } catch (err) {
        console.error("Failed to load cities:", err);
      }
    };
    fetchCities();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "price" && parseInt(value) < 0) {
      toast.error("Price cannot be negative");
      return;
    }
    setRoomData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityChange = (e) => {
    const amenity = e.target.value;
    setRoomData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      toast.error("You can upload a maximum of 5 images.");
      return;
    }
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location || !city || !address) {
      toast.error("Please select a location from the map and city/address.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("location", JSON.stringify(location.geo));
      formData.append("locationName", city);
      formData.append("address", address);

      Object.entries(roomData).forEach(([key, val]) => {
        if (Array.isArray(val)) {
          val.forEach((item) => formData.append(key, item));
        } else {
          formData.append(key, val);
        }
      });
      images.forEach((img) => formData.append("images", img));

      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/landlord/add-room`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Room added successfully!");
        navigate("/landlord/dashboard");
      } else {
        toast.error(data.message || "Error adding room");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error submitting form");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto p-4 sm:p-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Add New Room</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input name="title" placeholder="Title" onChange={handleChange} required className="w-full border p-3 rounded" />
          <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full border p-3 rounded" />
          <input name="price" type="number" placeholder="Price" onChange={handleChange} required className="w-full border p-3 rounded" />
          <select name="category" value={roomData.category} onChange={handleChange} required className="w-full border p-3 rounded">
            <option value="">Select Category</option>
            <option value="room">Room</option>
            <option value="flat">Flat</option>
            <option value="house">House</option>
          </select>

          <select value={city} onChange={(e) => setCity(e.target.value)} required className="w-full border p-3 rounded">
            <option value="">Select City</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <input
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Full Address"
            required
            className="w-full border p-3 rounded"
          />

          <div>
            <label className="flex items-center gap-2 font-medium text-gray-700"><MapPin size={18} /> Click map to set location</label>
            <MapContainer center={[27.7172, 85.324]} zoom={13} scrollWheelZoom className="h-60 rounded-lg border shadow">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
              <LocationSelector cities={cities} onSelectLocation={({ geo, city: detectedCity, address }) => {
                setLocation({ geo });
                if (cities.includes(detectedCity)) setCity(detectedCity);
                setAddress(address);
              }} />
            </MapContainer>
            {location && (
              <p className="text-sm text-green-600 mt-2">
                Coordinates: {location.geo.coordinates[1].toFixed(5)}, {location.geo.coordinates[0].toFixed(5)}
              </p>
            )}
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-2">Amenities</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {["WiFi", "AC", "TV", "Laundry", "Parking"].map((a) => (
                <label key={a} className="flex items-center gap-2 text-gray-600">
                  <input type="checkbox" value={a} onChange={handleAmenityChange} className="accent-blue-600" />
                  {a}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 font-medium text-gray-700">
              <UploadCloud size={20} /> Upload Images (Max 5)
            </label>
            <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="mt-2" />
            <div className="flex flex-wrap gap-3 mt-3">
              {images.map((img, i) => (
                <div key={i} className="relative w-24 h-24">
                  <img src={URL.createObjectURL(img)} alt={`preview-${i}`} className="w-full h-full object-cover rounded" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1 text-white">
                    <XCircle size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
            <CheckSquare size={20} /> Submit Room
          </button>
        </form>
      </div>
    </>
  );
}
