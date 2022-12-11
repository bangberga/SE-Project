import { Outlet, Navigate } from "react-router-dom";
import { getCookie } from "../../utils/cookie";
import { useUser } from "../context/UserProvider";

export default function NavigateRoute() {
  const { user: admin } = useUser();
  const navigateUrl = getCookie("navigateAdminUrl");

  return admin ? (
    <Navigate to={navigateUrl ? navigateUrl : "/admin"} replace />
  ) : (
    <Outlet />
  );
}
