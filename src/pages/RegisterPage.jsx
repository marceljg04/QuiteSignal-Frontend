import { Link } from "react-router-dom";
import Register from "../components/Auth/Register";

export default function RegisterPage() {
  return (
    <div className="page-full">
      <div className="auth-wrapper">
        <Register />

        <div className="ml-box flex flex-col justify-center">
          <Link to="/" className="link-btn link-blue">
            Return to login
          </Link>
        </div>
      </div>
    </div>
  );
}