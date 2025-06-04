import React from "react";
import { Link } from "react-router-dom";
import {
  PlusSquare, Building2, ClipboardList
} from "lucide-react";
import Navbar from "../../components/Navbar";

export default function LandlordDashboard() {
  return (
    <> 
    <Navbar />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Landlord Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/landlord/add-room"
          className="bg-blue-100 hover:bg-blue-200 p-6 rounded-xl shadow transition flex flex-col items-start gap-3"
        >
          <PlusSquare size={32} className="text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-blue-800">Add New Room</h3>
            <p className="text-sm text-blue-700">List a property for rent</p>
          </div>
        </Link>

        <Link
          to="/landlord/my-rooms"
          className="bg-green-100 hover:bg-green-200 p-6 rounded-xl shadow transition flex flex-col items-start gap-3"
        >
          <Building2 size={32} className="text-green-600" />
          <div>
            <h3 className="text-lg font-semibold text-green-800">Manage My Rooms</h3>
            <p className="text-sm text-green-700">Edit or remove listings</p>
          </div>
        </Link>

        <Link
          to="/landlord/bookings"
          className="bg-purple-100 hover:bg-purple-200 p-6 rounded-xl shadow transition flex flex-col items-start gap-3"
        >
          <ClipboardList size={32} className="text-purple-600" />
          <div>
            <h3 className="text-lg font-semibold text-purple-800">Tenant Bookings</h3>
            <p className="text-sm text-purple-700">See booking details</p>
          </div>
        </Link>
      </div>
    </div>
    </>
  );
}
