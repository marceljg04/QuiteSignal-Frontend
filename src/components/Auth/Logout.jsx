import { logout } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

export default function LogoutButton() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogout = async () => {
    try {
      const res = await logout(); 
      setUser(null); 
      
      navigate("/"); 
      
    } catch (error) {
      console.error("Error durante el proceso de Logout (Red o Servidor):", error);
      
      setUser(null);
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