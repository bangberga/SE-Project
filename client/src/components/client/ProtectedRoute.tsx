import { Outlet, Navigate } from "react-router-dom";
import { useUser } from "../context/UserProvider";

export default function ProtectedRoute() {
  const { user: client } = useUser();

  return client ? <Outlet /> : <Navigate to="/login" />;
}
