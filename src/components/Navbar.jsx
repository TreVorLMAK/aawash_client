
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow py-3 px-6 flex items-center justify-between">
      {/* Logo and Title */}
      <div className="flex items-center space-x-2">
        <img src="/logo.png" alt="logo" className="h-8 w-8" />
        <span className="text-lg font-bold text-gray-800">Aawash</span>
      </div>

      {/* Center Links */}
      <ul className="flex space-x-6 font-medium text-gray-700">
        <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
        <li><Link to="/rooms" className="hover:text-blue-600">Room</Link></li>
        <li><Link to="/flats" className="hover:text-blue-600">Flat</Link></li>
        <li><Link to="/map" className="hover:text-blue-600">Map</Link></li>
        <li><Link to="/chat" className="hover:text-blue-600">Chat</Link></li>
      </ul>

      {/* Auth Buttons */}
      <div className="flex items-center space-x-3">
        <Link to="/login" className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition">
          Login
        </Link>
        <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          SignUp
        </Link>
      </div>
    </nav>
  );
}
