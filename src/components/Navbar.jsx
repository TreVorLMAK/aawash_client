export default function Navbar() {
    return (
      <nav className="flex justify-between items-center px-6 py-4 bg-black text-white border-b border-white/10">
        <h1 className="text-2xl font-bold tracking-tight">Aawash</h1>
        <div className="space-x-6 text-sm font-medium">
          <a href="#" className="hover:text-gray-300">Login</a>
          <a href="#" className="hover:text-gray-300">Register</a>
        </div>
      </nav>
    );
  }
  