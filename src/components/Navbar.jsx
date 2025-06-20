import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Home, BedDouble, MapPin, MessageSquare,
  LogIn, UserPlus, Menu, X, User, Settings,
  LayoutDashboard, ChevronDown, ChevronRight
} from "lucide-react";
import toast from "react-hot-toast";
import API from "../utils/api";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDashboardSubmenu, setShowDashboardSubmenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch(`${API}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUser(data);
    } catch {
      setUser(null);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch(`${API}/messages/unread/count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUnreadCount(data.count || 0);
    } catch {}
  };

  useEffect(() => {
    fetchProfile();
    fetchUnreadCount();
  }, []);

  useEffect(() => {
    if (location.pathname === "/chat") {
      setUnreadCount(0);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleSwitchRole = async (role) => {
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
        fetchProfile();
        navigate(role === "landlord" ? "/landlord/dashboard" : "/tenant/dashboard");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to switch role");
    }
  };

  const navLinks = (
    <>
      <li>
        <Link to="/" className="flex items-center gap-1 hover:text-blue-600">
          <Home size={18} /> Home
        </Link>
      </li>
      <li>
        <Link to="/room" className="flex items-center gap-1 hover:text-blue-600">
          <BedDouble size={18} /> Listings
        </Link>
      </li>
      <li>
        <Link to="/map" className="flex items-center gap-1 hover:text-blue-600">
          <MapPin size={18} /> Map
        </Link>
      </li>
      <li className="relative">
        <Link to="/chat" className="flex items-center gap-1 hover:text-blue-600">
          <MessageSquare size={18} /> Chat
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-3 bg-red-600 text-white text-xs rounded-full px-1.5">
              {unreadCount}
            </span>
          )}
        </Link>
      </li>
    </>
  );

  return (
    <nav className="bg-white shadow px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <img src="/logo.png" alt="logo" className="h-12 w-12 object-contain" />
          <span className="text-2xl font-extrabold text-gray-800 tracking-wide">Aawash</span>
        </Link>

        <ul className="hidden md:flex space-x-6 font-medium text-gray-700 items-center">
          {navLinks}
        </ul>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                <img
                  src={user.profilePicture || "/avatar.png"}
                  alt="profile"
                  className="h-9 w-9 rounded-full object-cover border"
                />
                {user.firstName}
                <ChevronDown size={16} />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white border rounded shadow z-50">
                  <div className="px-4 py-2 text-sm text-gray-800 font-medium border-b">
                    {user.firstName} {user.lastName}
                  </div>

                  <button
                    onClick={() => setShowDashboardSubmenu(!showDashboardSubmenu)}
                    className="flex items-center justify-between w-full px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                  >
                    <span className="flex items-center gap-2">
                      <LayoutDashboard size={16} /> Dashboard
                    </span>
                    <ChevronRight size={16} className={`${showDashboardSubmenu ? "rotate-90" : ""} transition`} />
                  </button>
                  {showDashboardSubmenu && (
                    <div className="pl-8">
                      {user.role === "tenant" && (
                        <Link to="/tenant/dashboard" className="block py-1 text-blue-600 hover:underline">
                          Tenant Dashboard
                        </Link>
                      )}
                      {user.role === "landlord" && (
                        <Link to="/landlord/dashboard" className="block py-1 text-blue-600 hover:underline">
                          Landlord Dashboard
                        </Link>
                      )}
                    </div>
                  )}

                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                    <User size={16} /> View Profile
                  </Link>
                  <Link to="/profile/edit" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                    <Settings size={16} /> Edit Profile
                  </Link>

                  {["tenant", "landlord"].includes(user.role) &&
                    ["tenant", "landlord"].filter(r => r !== user.role).map(role => (
                      <button
                        key={role}
                        onClick={() => handleSwitchRole(role)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Switch to {role.charAt(0).toUpperCase() + role.slice(1)}
                      </button>
                    ))
                  }

                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-1 px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition">
                <LogIn size={18} /> Login
              </Link>
              <Link to="/register" className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                <UserPlus size={18} /> SignUp
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden mt-3 space-y-4">
          <ul className="flex flex-col space-y-3 text-gray-700 font-medium">{navLinks}</ul>

          {user && (
            <div className="border-t pt-4 space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-3 px-2">
                <img src={user.profilePicture || "/avatar.png"} alt="avatar" className="h-9 w-9 rounded-full border object-cover" />
                <div>
                  <div className="font-semibold">{user.firstName}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
              </div>

              <div className="px-4">
                <div className="font-medium mb-1">Dashboard</div>
                {user.role === "tenant" && (
                  <Link to="/tenant/dashboard" className="block py-1 text-blue-600 hover:underline">Tenant Dashboard</Link>
                )}
                {user.role === "landlord" && (
                  <Link to="/landlord/dashboard" className="block py-1 text-blue-600 hover:underline">Landlord Dashboard</Link>
                )}
              </div>

              <Link to="/profile" className="block px-4 py-1 hover:bg-gray-100 rounded">View Profile</Link>
              <Link to="/profile/edit" className="block px-4 py-1 hover:bg-gray-100 rounded">Edit Profile</Link>

              {["tenant", "landlord"].includes(user.role) &&
                ["tenant", "landlord"].filter(r => r !== user.role).map(role => (
                  <button
                    key={role}
                    onClick={() => handleSwitchRole(role)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Switch to {role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                ))
              }

              <button onClick={() => setShowLogoutModal(true)} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 rounded">
                Logout
              </button>
            </div>
          )}
        </div>
      )}

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Are you sure you want to logout?</h2>
            <div className="flex justify-center gap-4">
              <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
                Yes, Logout
              </button>
              <button onClick={() => setShowLogoutModal(false)} className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100 transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
