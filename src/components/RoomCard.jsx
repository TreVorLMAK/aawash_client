import React from "react";
import { motion } from "framer-motion";
import { MapPin, Wifi, Car, Bath } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

export default function RoomCard({ room }) {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={() => navigate(`/room/${room._id}`)}
      className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-all cursor-pointer"
    >
      <Swiper
        pagination={{ clickable: true }}
        modules={[Pagination]}
        className="w-full h-48"
      >
        {room.images?.length > 0 ? (
          room.images.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={img}
                alt={`room-${index}`}
                className="w-full h-48 object-cover"
              />
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <img
              src="/no-image.jpg"
              alt="no-room"
              className="w-full h-48 object-cover"
            />
          </SwiperSlide>
        )}
      </Swiper>

      <div className="p-4 space-y-2">
        <h2 className="text-lg font-semibold">{room.title}</h2>
        <div className="text-sm text-gray-500 flex items-center gap-1">
          <MapPin size={16} /> {room.locationName || "Unknown"}
        </div>
        <div className="text-sm text-blue-600 font-semibold">Rs. {room.price}</div>
        <div className="flex gap-2 text-xs text-gray-600 flex-wrap">
          {room.amenities?.includes("WiFi") && (
            <span className="flex items-center gap-1">
              <Wifi size={14} /> WiFi
            </span>
          )}
          {room.amenities?.includes("Parking") && (
            <span className="flex items-center gap-1">
              <Car size={14} /> Parking
            </span>
          )}
          {room.amenities?.includes("Attached Bathroom") && (
            <span className="flex items-center gap-1">
              <Bath size={14} /> Bathroom
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/room/${room._id}`);
          }}
          className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          View Details
        </button>
      </div>
    </motion.div>
  );
}
