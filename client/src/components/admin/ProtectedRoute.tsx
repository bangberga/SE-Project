import ProtectedRoute from "../ProtectedRoute";

export default function AdminProtectedRoute() {
  return <ProtectedRoute navigatePath="/admin/login" />;
}
