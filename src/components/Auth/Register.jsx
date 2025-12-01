    import { useState } from "react";
import { register } from "../../api/auth";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const response = await register(username, email, password);
      console.log(response);
    } catch (error) {
      console.error("Error al registrarse:", error);
    }
  };

  return (
    <div className="flex flex-col w-80 p-6 bg-white shadow-xl rounded-xl">
      <h1 className="text-2xl font-bold text-center mb-4">Register</h1>
      
      <input
        className="border p-2 rounded mb-3"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      
      <input
        className="border p-2 rounded mb-3"
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      
      <input
        className="border p-2 rounded mb-3"
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      
      <button
        className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
        onClick={handleRegister}
      >
        Registrarse
      </button>
    </div>
  );
}
