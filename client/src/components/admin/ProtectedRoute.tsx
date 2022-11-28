import { Outlet, Navigate } from "react-router-dom";
import { useAdmin } from "./AdminProvider";

export default function ProtectedRoute() {
  const { admin } = useAdmin();
  return admin ? <Outlet /> : <Navigate to="/admin/login" />;
}
