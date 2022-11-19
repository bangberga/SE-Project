import { Outlet, Navigate } from "react-router-dom";
import { useGlobalContext } from "../../App";
import { getCookie } from "../../utils/cookie";

export default function NavigateRoute() {
  const { user } = useGlobalContext();
  const navigateUrl = getCookie("navigateUrl");

  return user ? (
    <Navigate to={navigateUrl ? navigateUrl : "/products"} replace />
  ) : (
    <Outlet />
  );
}
