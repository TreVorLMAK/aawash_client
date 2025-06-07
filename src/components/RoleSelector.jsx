import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../utils/api";
import { Home, Briefcase } from "lucide-react";

export default function RoleSelector() {
  const navigate = useNavigate();

  const handleRoleChange = async (role) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/auth/switch-role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        role === "landlord"
          ? navigate("/landlord/dashboard")
          : navigate("/room"); // or tenant dashboard
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Role change failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center p-8 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Choose Your Role
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => handleRoleChange("tenant")}
            className="border border-blue-500 text-blue-600 p-4 rounded-lg hover:bg-blue-50 transition flex flex-col items-center"
          >
            <Home size={32} />
            <span className="mt-2 font-medium">I’m a Tenant</span>
          </button>

          <button
            onClick={() => handleRoleChange("landlord")}
            className="border border-green-500 text-green-600 p-4 rounded-lg hover:bg-green-50 transition flex flex-col items-center"
          >
            <Briefcase size={32} />
            <span className="mt-2 font-medium">I’m a Landlord</span>
          </button>
        </div>
      </div>
    </div>
  );
}
