import React from "react";

const amenitiesOptions = ["WiFi", "Parking", "Attached Bathroom"];
const categoryOptions = ["room", "flat", "house"];

export default function FilterBar({ filters, setFilters, toggleAmenity, cities }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      {/* City Dropdown */}
      <select
        className="border p-2 rounded"
        value={filters.city}
        onChange={(e) => setFilters({ ...filters, city: e.target.value })}
      >
        <option value="">All Cities</option>
        {cities.map((city) => (
          <option key={city}>{city}</option>
        ))}
      </select>

      {/* Category Filter */}
      <select
        className="border p-2 rounded"
        value={filters.category || ""}
        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
      >
        <option value="">All Types</option>
        {categoryOptions.map((c) => (
          <option key={c} value={c}>
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </option>
        ))}
      </select>

      {/* Price Range */}
      <input
        type="number"
        placeholder="Min Price"
        className="border p-2 rounded"
        value={filters.minPrice}
        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
      />
      <input
        type="number"
        placeholder="Max Price"
        className="border p-2 rounded"
        value={filters.maxPrice}
        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
      />

      {/* Amenity Toggles */}
      <div className="flex gap-2 flex-wrap col-span-full">
        {amenitiesOptions.map((item) => (
          <button
            key={item}
            onClick={() => toggleAmenity(item)}
            className={`px-3 py-1 rounded-full text-sm border transition-all ${
              filters.amenities.includes(item)
                ? "bg-blue-600 text-white border-blue-600"
                : "text-gray-600 border-gray-300"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
