import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin, ClipboardList, BedDouble
} from "lucide-react";
import Navbar from "../../components/Navbar";

export default function TenantDashboard() {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Tenant Dashboard</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/room"
            className="bg-yellow-100 hover:bg-yellow-200 p-6 rounded-xl shadow transition flex flex-col items-start gap-3"
          >
            <MapPin size={32} className="text-yellow-600" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">Browse Listings</h3>
              <p className="text-sm text-yellow-700">Find rooms, flats & houses</p>
            </div>
          </Link>

          <Link
            to="/tenant/bookings"
            className="bg-indigo-100 hover:bg-indigo-200 p-6 rounded-xl shadow transition flex flex-col items-start gap-3"
          >
            <ClipboardList size={32} className="text-indigo-600" />
            <div>
              <h3 className="text-lg font-semibold text-indigo-800">My Bookings</h3>
              <p className="text-sm text-indigo-700">Manage your reservations</p>
            </div>
          </Link>

          <Link
            to="/map"
            className="bg-pink-100 hover:bg-pink-200 p-6 rounded-xl shadow transition flex flex-col items-start gap-3"
          >
            <BedDouble size={32} className="text-pink-600" />
            <div>
              <h3 className="text-lg font-semibold text-pink-800">Map View</h3>
              <p className="text-sm text-pink-700">Explore locations visually</p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
