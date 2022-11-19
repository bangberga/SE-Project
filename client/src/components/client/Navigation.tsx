import { NavLink } from "react-router-dom";
import { signOut } from "firebase/auth";
import { useGlobalContext } from "../../App";
import { useCallback } from "react";
import { auth } from "../../utils/firebaseConfig";

export default function Navigation() {
  const { user } = useGlobalContext();

  const logOut = useCallback(async () => {
    await signOut(auth);
  }, []);

  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/products">Products</NavLink>
        </li>
        <li>
          <NavLink to="/register">Register</NavLink>
        </li>
        <li>
          {user ? (
            <button onClick={logOut}>Logout</button>
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}
        </li>
      </ul>
    </nav>
  );
}
