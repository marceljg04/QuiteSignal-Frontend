import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../api/auth";

export default function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !username || !email || !password) {
      setError("Omple tots els camps, sisplau");
      return;
    }

    if (password !== confirmPassword) {
      setError("Les contrasenyes no coincideixen");
      return;
    }

    if (password.length < 6) {
      setError("La contrasenya ha de tenir almenys 6 caràcters");
      return;
    }

    setLoading(true);
    try {
      const response = await register(name, username, email, password);

      if (response.success) {
        navigate("/");
      } else {
        setError(response.errors || response.message || "No s'ha pogut crear el compte");
      }
    } catch (err) {
      console.error("Error al registrar:", err);
      setError("No s'ha pogut crear el compte, torna-ho a provar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card animate-fade-in">
      <h1 className="card-title">Crea el teu diari</h1>
      <p className="card-subtitle">Comença a cuidar el teu benestar emocional</p>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label className="form-label">Nom</label>
          <input
            className="input"
            placeholder="Com et dius?"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Usuari</label>
          <input
            className="input"
            placeholder="Tria un nom d'usuari"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Correu electrònic</label>
          <input
            className="input"
            type="email"
            placeholder="El teu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Contrasenya</label>
          <input
            className="input"
            type="password"
            placeholder="Crea una contrasenya"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Repeteix la contrasenya</label>
          <input
            className="input"
            type="password"
            placeholder="Torna a escriure-la"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary btn-block"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creant compte..." : "Crear compte"}
        </button>
      </form>

      <p className="text-center mt-3" style={{ color: 'var(--text-secondary)' }}>
        Ja tens compte?{" "}
        <Link to="/" className="link">
          Entra aquí
        </Link>
      </p>
    </div>
  );
}
