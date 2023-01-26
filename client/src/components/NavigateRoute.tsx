import { Outlet, Navigate } from "react-router-dom";
import { getCookie } from "../utils/cookie";
import { useUserContext } from "./context/UserProvider";

interface NavigateRouteProps {
  baseUrl: string;
  cookieUrl: string;
}

export default function NavigateRoute(props: NavigateRouteProps) {
  const { baseUrl, cookieUrl } = props;
  const { user } = useUserContext();
  const navigateUrl = getCookie(cookieUrl);

  return user ? (
    <Navigate to={navigateUrl ? navigateUrl : baseUrl} replace />
  ) : (
    <Outlet />
  );
}
