import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../api/auth";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout error:", err);
    }
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        <span>🌙</span>
        <span>Aurora Minds</span>
      </Link>

      <div className="navbar-nav">
        <Link
          to="/dashboard"
          className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
        >
          Calendari
        </Link>
        <Link
          to="/journal"
          className={`nav-link ${isActive("/journal") ? "active" : ""}`}
        >
          Historial
        </Link>
        <button
          onClick={handleLogout}
          className="btn btn-ghost"
        >
          Sortir
        </button>
      </div>
    </nav>
  );
}
