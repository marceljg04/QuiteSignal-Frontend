import { useState } from "react";
import { Link } from "react-router-dom";
import Login from "../components/Auth/Login";

export default function AuthPage() {
  const [showLogin] = useState(true);

  return (
    <div className="page-full">
      <div className="auth-wrapper">
        {showLogin && <Login />}

          <div className="ml-box flex flex-col justify-center">
          <Link to="/register" className="link-btn link-green">
            Sign-in
          </Link>
        </div>
      </div>
    </div>
  );
}