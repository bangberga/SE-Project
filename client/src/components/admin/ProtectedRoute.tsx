import { Outlet, Navigate } from "react-router-dom";
import { useUser } from "../context/UserProvider";

export default function ProtectedRoute() {
  const { user: admin } = useUser();
  return admin ? <Outlet /> : <Navigate to="/admin/login" />;
}
