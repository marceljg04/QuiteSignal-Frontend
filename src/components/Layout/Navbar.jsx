import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Calendar, BookOpen, LogOut } from "lucide-react";
import { logout } from "../../api/auth";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true";
  });

  useEffect(() => {
    localStorage.setItem("darkMode", isDarkMode);
    document.documentElement.setAttribute("data-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

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
      <div className="navbar-brand" onClick={toggleTheme} style={{ cursor: "pointer" }}>
        <span style={{ fontSize: isDarkMode ? "1.1rem" : "1.25rem" }}>{isDarkMode ? "🌙" : "☀️"}</span>
        <span>{isDarkMode ? "Selene" : "Apol·lo"}</span>
      </div>

      <div className="navbar-nav">
        <Link
          to="/dashboard"
          className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}
        >
          <Calendar size={18} />
          <span>Calendari</span>
        </Link>
        <Link
          to="/journal"
          className={`nav-link ${isActive("/journal") ? "active" : ""}`}
        >
          <BookOpen size={18} />
          <span>Historial</span>
        </Link>
        <button
          onClick={handleLogout}
          className="btn btn-ghost"
        >
          <LogOut size={18} />
          <span className="logout-text">Sortir</span>
        </button>
      </div>
    </nav>
  );
}
