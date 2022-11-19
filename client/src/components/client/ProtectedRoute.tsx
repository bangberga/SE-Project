import { Outlet, Navigate } from "react-router-dom";
import { useGlobalContext } from "../../App";

export default function ProtectedRoute() {
  const { user } = useGlobalContext();

  return user ? <Outlet /> : <Navigate to="/login" />;
}
