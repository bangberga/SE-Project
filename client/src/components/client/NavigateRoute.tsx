import { Outlet, Navigate } from "react-router-dom";
import { getCookie } from "../../utils/cookie";
import { useClient } from "./ClientProvider";

export default function NavigateRoute() {
  const { client } = useClient();
  const navigateUrl = getCookie("navigateClientUrl");

  return client ? (
    <Navigate to={navigateUrl ? navigateUrl : "/products"} replace />
  ) : (
    <Outlet />
  );
}
