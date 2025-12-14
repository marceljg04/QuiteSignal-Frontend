import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/auth";
import { useAuth } from "../../Context/AuthContext";

export default function Login() {
  const [userInput, setUserInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/analyze");
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    setError("");

    if (!userInput || !password) {
      setError("Username and password are required");
      return;
    }

    try {
      const response = await login(userInput, password);

      if (response.code && response.data?.user) {
        setUser(response.data.user);
      } else {
        setError(response.errors || response.message || "Login failed");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setError("Login failed, please try again");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleLogin();
    }
  };

  return (
    <div className="card">
      <h1 className="card-title">Login</h1>

      {error && <p className="error-text">{error}</p>}

      <input
        className="input"
        placeholder="Username"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <input
        className="input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <button className="btn btn-primary" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
}
