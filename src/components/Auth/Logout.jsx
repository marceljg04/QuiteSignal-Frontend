import { logout } from "../../api/auth";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const res = await logout();
    if (res.success) {
      navigate("/");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="btn-small btn-danger"
    >
      Logout
    </button>
  );
}
