import { Outlet, Navigate } from "react-router-dom";
import { getCookie } from "../../utils/cookie";
import { useAdmin } from "./AdminProvider";

export default function NavigateRoute() {
  const { admin } = useAdmin();
  const navigateUrl = getCookie("navigateAdminUrl");

  return admin ? (
    <Navigate to={navigateUrl ? navigateUrl : "/admin"} replace />
  ) : (
    <Outlet />
  );
}
