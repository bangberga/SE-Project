import { Outlet, Navigate } from "react-router-dom";
import { getCookie } from "../../utils/cookie";
import { useUser } from "../context/UserProvider";

export default function NavigateRoute() {
  const { user: client } = useUser();
  const navigateUrl = getCookie("navigateClientUrl");

  return client ? (
    <Navigate to={navigateUrl ? navigateUrl : "/products"} replace />
  ) : (
    <Outlet />
  );
}
