import { useState } from "react";
import { Link } from "react-router-dom";
import Login from "../components/Auth/Login";

export default function AuthPage() {
  const [showLogin] = useState(true);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {showLogin && <Login />}
      <div className="flex flex-col justify-center ml-6">
        <Link
          to="/register"
          className="bg-green-600 text-white p-2 rounded hover:bg-green-700 text-center"
        >
          Registrarse
        </Link>
      </div>
    </div>
  );
}
