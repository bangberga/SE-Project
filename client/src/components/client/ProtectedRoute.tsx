import { Outlet, Navigate } from "react-router-dom";
import { useClient } from "./ClientProvider";

export default function ProtectedRoute() {
  const { client } = useClient();

  return client ? <Outlet /> : <Navigate to="/login" />;
}
