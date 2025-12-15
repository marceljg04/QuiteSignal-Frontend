import LogoutButton from "./Auth/Logout";
import { useAuth } from "../Hooks/useAuth";

export default function PageHeader({ title }) {
  const { user } = useAuth();

  return (
    <div className="relative flex justify-end items-center mb-10">
      
      <h1 className="page-title !mb-0 absolute inset-x-0 text-center pointer-events-none">
        {title}
      </h1>
      
      <div className="z-10 flex items-center space-x-4">
        {user && <span className="text-white font-medium">Hello, {user.name}</span>}
        <LogoutButton />
      </div>
    </div>
  );
}