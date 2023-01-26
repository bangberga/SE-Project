import ProtectedRoute from "../ProtectedRoute";

export default function ClientProtectedRoute() {
  return <ProtectedRoute navigatePath="/login" />;
}
