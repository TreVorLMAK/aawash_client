import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../../utils/api";
import Navbar from "../../components/Navbar";
import Spinner from "../../components/Spinner";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/tenant/my-bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setBookings(data.bookings || []);
      } catch (err) {
        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    const confirm = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/tenant/bookings/${bookingId}/cancel`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        toast.success("Booking cancelled");
        setBookings(bookings.map(b => b._id === bookingId ? { ...b, status: "Cancelled" } : b));
      } else {
        toast.error("Failed to cancel booking");
      }
    } catch (err) {
      toast.error("Error cancelling booking");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 min-h-screen">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Bookings</h2>

        {loading ? (
          <Spinner />
        ) : bookings.length === 0 ? (
          <p className="text-gray-500 text-center mt-20">You haven’t booked any rooms yet.</p>
        ) : (
          <div className="grid gap-6">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="bg-white rounded-lg shadow p-4 flex flex-col sm:flex-row gap-4 items-start"
              >
                <img
                  src={b.room?.images?.[0] || "/no-image.jpg"}
                  alt={b.room?.title}
                  className="w-full sm:w-48 h-32 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{b.room?.title}</h3>
                  <p className="text-sm text-gray-600">{b.room?.locationName}</p>
                  <p className="text-sm text-gray-600">
                    Rs. {b.room?.price?.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Check-In: {new Date(b.checkInDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Check-Out: {new Date(b.checkOutDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm font-medium mt-1">
                    Status:{" "}
                    <span
                      className={`${
                        b.status === "Confirmed"
                          ? "text-green-600"
                          : b.status === "Cancelled"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {b.status}
                    </span>
                  </p>

                  {b.status === "Pending" && (
                    <button
                      onClick={() => handleCancel(b._id)}
                      className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
