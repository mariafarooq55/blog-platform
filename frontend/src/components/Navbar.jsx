import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gray-900 border-b border-purple-900 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-purple-400">
          ✍️ BlogSpace
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-gray-400 hover:text-purple-400 text-sm transition"
          >
            Home
          </Link>

          {user ? (
            <>
              <Link
                to="/create-post"
                className="text-gray-400 hover:text-purple-400 text-sm transition"
              >
                Write
              </Link>
              <Link
                to="/my-posts"
                className="text-gray-400 hover:text-purple-400 text-sm transition"
              >
                My Posts
              </Link>
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="text-gray-400 hover:text-purple-400 text-sm transition"
                >
                  Admin
                </Link>
              )}
              <Link to="/profile">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-red-400 hover:text-red-300 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-400 hover:text-purple-400 text-sm transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
