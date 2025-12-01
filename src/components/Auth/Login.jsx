import { useState } from "react";
import { login } from "../../api/auth";

export default function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await login(user, password);
      console.log(response);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <div className="flex flex-col w-80 p-6 bg-white shadow-xl rounded-xl">
      <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
      
      <input
        className="border p-2 rounded mb-3"
        placeholder="Usuario"
        value={user}
        onChange={(e) => setUser(e.target.value)}
      />
      
      <input
        className="border p-2 rounded mb-3"
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      
      <button
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        onClick={handleLogin}
      >
        Iniciar sesión
      </button>
    </div>
  );
}
