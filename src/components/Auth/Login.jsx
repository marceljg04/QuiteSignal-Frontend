import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../api/auth";

export default function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!user || !password) {
      setError("Necessito el teu usuari i contrasenya");
      return;
    }

    setLoading(true);
    try {
      const response = await login(user, password);

      if (response.success) {
        navigate("/dashboard");
      } else {
        setError(response.errors || response.message || "No he pogut iniciar sessió");
      }
    } catch (err) {
      console.error("Error al iniciar sessió:", err);
      setError("No he pogut iniciar sessió, torna-ho a provar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card animate-fade-in">
      <h1 className="card-title">Hola de nou!</h1>
      <p className="card-subtitle">Entra al teu diari personal</p>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label className="form-label">Usuari</label>
          <input
            className="input"
            placeholder="El teu nom d'usuari"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Contrasenya</label>
          <input
            className="input"
            type="password"
            placeholder="La teva contrasenya"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary btn-block"
          type="submit"
          disabled={loading}
        >
          {loading ? "Entrant..." : "Entrar"}
        </button>
      </form>

      <p className="text-center mt-3" style={{ color: 'var(--text-secondary)' }}>
        Encara no tens compte?{" "}
        <Link to="/register" className="link">
          Crea'n un
        </Link>
      </p>
    </div>
  );
}
