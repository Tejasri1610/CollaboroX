import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <span className="text-white font-bold text-lg">CX</span>
          </div>
          <span className="font-bold text-xl">CollaboroX</span>
        </div>

        {/* Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/solutions" className="hover:text-blue-600">Solutions</Link>
          <Link to="/work" className="hover:text-blue-600">Work</Link>
          <Link to="/about" className="hover:text-blue-600">About</Link>
          <Link to="/login" className="hover:text-blue-600">Login</Link>
          <Link to="/signup" className="hover:text-blue-600">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
}
