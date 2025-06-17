import React, { useEffect, useState } from "react";
import { Pencil, Trash2, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../utils/api";
import Navbar from "../../components/Navbar";

export default function MyRooms() {
  const [rooms, setRooms] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/landlord/my-rooms`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRooms(data.rooms || []);
    } catch (err) {
      toast.error("Failed to load your rooms");
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const deleteRoom = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/landlord/delete-room/${deleteTarget}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success("Room deleted");
        setRooms((prev) => prev.filter((r) => r._id !== deleteTarget));
      } else {
        toast.error("Failed to delete room");
      }
    } catch (err) {
      toast.error("Error deleting room");
    } finally {
      setShowModal(false);
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">My Listed Rooms</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div key={room._id} className="border rounded-lg p-4 shadow">
              <img
                src={room.images?.[0] || "/no-image.jpg"}
                alt={room.title}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h3 className="font-semibold text-lg">{room.title}</h3>

              {room.location?.coordinates ? (
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin size={14} />
                  {room.location.coordinates[1].toFixed(5)}, {room.location.coordinates[0].toFixed(5)}
                </p>
              ) : (
                <p className="text-sm text-gray-400 italic">No location</p>
              )}

              <p className="text-sm text-blue-600 font-medium">Rs. {room.price}</p>

              <div className="flex gap-3 mt-3">
                <Link
                  to={`/landlord/edit-room/${room._id}`}
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Pencil size={16} /> Edit
                </Link>
                <button
                  onClick={() => {
                    setDeleteTarget(room._id);
                    setShowModal(true);
                  }}
                  className="text-red-600 hover:underline flex items-center gap-1"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete this room? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteRoom}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
