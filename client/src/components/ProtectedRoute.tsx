import { Outlet, Navigate } from "react-router-dom";
import { useUserContext } from "./context/UserProvider";

interface ProtectedRouteProps {
  navigatePath: string;
}

export default function ProtectedRoute(props: ProtectedRouteProps) {
  const { navigatePath } = props;
  const { user } = useUserContext();

  return user ? <Outlet /> : <Navigate to={navigatePath} />;
}
