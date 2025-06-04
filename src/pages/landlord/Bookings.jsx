import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../../utils/api";
import Navbar from "../../components/Navbar";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/landlord/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setBookings(data.bookings || []);
      } catch (err) {
        toast.error("Failed to load bookings");
      }
    };

    fetchBookings();
  }, []);

  return (
    <> 
    <Navbar />
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Tenant Bookings</h2>
      <div className="space-y-4">
        {bookings.map((b) => (
          <div key={b._id} className="border p-4 rounded-lg shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between">
              <div>
                <p className="font-semibold text-gray-800">{b.room?.title}</p>
                <p className="text-sm text-gray-500">Tenant ID: {b.tenant}</p>
              </div>
              <div className="text-sm text-right text-gray-600">
                <p>Check-In: {new Date(b.checkInDate).toLocaleDateString()}</p>
                <p>Check-Out: {new Date(b.checkOutDate).toLocaleDateString()}</p>
                <p>Status: <span className="font-medium">{b.status}</span></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
