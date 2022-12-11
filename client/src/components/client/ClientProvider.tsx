import { Outlet } from "react-router-dom";
import UserProvider from "../context/UserProvider";
import Navigation from "./Navigation";

export default function AdminProvider() {
  return (
    <UserProvider role="client">
      <Navigation />
      <Outlet />
    </UserProvider>
  );
}
