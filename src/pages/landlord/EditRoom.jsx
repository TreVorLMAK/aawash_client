import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../utils/api";
import Navbar from "../../components/Navbar";

export default function EditRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [roomData, setRoomData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    locationName: "",
  });

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch(`${API}/landlord/my-rooms`);
        const data = await res.json();
        const room = data.rooms.find((r) => r._id === roomId);
        if (room) {
          setRoomData({
            title: room.title,
            description: room.description,
            price: room.price,
            category: room.category,
            locationName: room.locationName,
          });
        }
      } catch {
        toast.error("Failed to fetch room data");
      }
    };

    fetchRoom();
  }, [roomId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/landlord/edit-room/${roomId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(roomData),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Room updated successfully");
        navigate("/landlord/my-rooms");
      } else {
        toast.error(data.message || "Failed to update room");
      }
    } catch {
      toast.error("Error updating room");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Edit Room</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            value={roomData.title}
            onChange={handleChange}
            placeholder="Room Title"
            className="w-full p-3 border rounded"
            required
          />
          <textarea
            name="description"
            value={roomData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-3 border rounded"
          />
          <input
            type="number"
            name="price"
            value={roomData.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full p-3 border rounded"
            required
          />
          <select
            name="category"
            value={roomData.category}
            onChange={handleChange}
            className="w-full p-3 border rounded"
            required
          >
            <option value="">Select Category</option>
            <option value="room">Room</option>
            <option value="flat">Flat</option>
            <option value="house">House</option>
          </select>
          <input
            name="locationName"
            value={roomData.locationName}
            onChange={handleChange}
            placeholder="Location Name"
            className="w-full p-3 border rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </form>
      </div>
    </>
  );
}
