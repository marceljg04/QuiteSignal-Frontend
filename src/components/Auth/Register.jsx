import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register, login } from "../../api/auth";
import { createJournal } from "../../api/journal";
import { useAuth } from "../../Context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleRegister = async () => {
    setError("");

    if (!name || !username || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      await register(name, username, email, password);

      const loginResponse = await login(username, password);

      if (loginResponse.success) {
        setUser(loginResponse.data.user);
        navigate("/analyze");
      } else {
        setError(loginResponse.message || "Login failed");
      }


      await createJournal(username + " Journal");

      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.detail || "Registration failed");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleRegister();
    }
  };

  return (
    <div className="card">
      <h1 className="card-title">Register</h1>

      {error && <p className="error-text">{error}</p>}

      <input
        className="input"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <input
        className="input"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <input
        className="input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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

      <button className="btn btn-success" onClick={handleRegister}>
        Sign in
      </button>
    </div>
  );
}
