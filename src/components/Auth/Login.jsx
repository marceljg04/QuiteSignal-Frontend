import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/auth";

export default function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    if (!user || !password) {
      setError("Username and password are required");
      return;
    }

    try {
      const response = await login(user, password);

      if (response.success) {
        navigate("/analyze");
      } else {
        setError(response.errors || response.message || "Login failed");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Login failed, please try again");
    }
  };

  return (
    <div className="card">
      <h1 className="card-title">Login</h1>

      {error && <p className="error-text">{error}</p>}

      <input
        className="input"
        placeholder="Username"
        value={user}
        onChange={(e) => setUser(e.target.value)}
      />

      <input
        className="input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="btn btn-primary"
        onClick={handleLogin}
      >
        Log in
      </button>
    </div>
  );
}
