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
      } catch {
        toast.error("Failed to load bookings");
      }
    };

    fetchBookings();
  }, []);

  const statusClass = {
    Applied: "bg-yellow-100 text-yellow-800",
    Approved: "bg-blue-100 text-blue-800",
    Paid: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
  };

  const updateStatus = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/landlord/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(`Booking ${newStatus.toLowerCase()} successfully`);
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingId ? { ...b, status: newStatus } : b
          )
        );
      } else {
        toast.error(data.message || "Failed to update booking");
      }
    } catch {
      toast.error("Error updating booking");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Tenant Bookings</h2>

        {bookings.length === 0 ? (
          <p className="text-gray-500">No bookings found.</p>
        ) : (
          <div className="grid gap-4">
            {bookings.map((b) => (
              <div key={b._id} className="bg-white border rounded-xl shadow-sm p-5">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {b.room?.title || "Untitled Room"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Tenant:{" "}
                      <span className="font-medium">
                        {b.tenant?.firstName} {b.tenant?.lastName}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">{b.tenant?.email}</p>
                  </div>

                  <div className="text-sm text-gray-700 space-y-1 text-right sm:text-left">
                    <p>
                      Status:{" "}
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${statusClass[b.status]}`}
                      >
                        {b.status}
                      </span>
                    </p>

                    {b.status === "Applied" && (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => updateStatus(b._id, "Approved")}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(b._id, "Rejected")}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
