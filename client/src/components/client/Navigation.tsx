import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { useUserContext } from "../context/UserProvider";
import Logo from "../Logo";
import Avatar from "../Avatar";

export default function Navigation() {
  const { user: client } = useUserContext();

  return (
    <Nav>
      <Logo />
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/products">Products</NavLink>
        </li>
        {client ? (
          ""
        ) : (
          <li>
            <NavLink to="/register">Register</NavLink>
          </li>
        )}
        <li>
          {client ? (
            <Avatar src={client.photoURL} />
          ) : (
            <NavLink to="/login">Login</NavLink>
          )}
        </li>
      </ul>
    </Nav>
  );
}

const Nav = styled.nav`
  display: flex;
  background-color: var(--mainWhite);
  box-shadow: var(--darkShadow);
  justify-content: space-between;
  align-items: center;
  padding: 10px 50px;
  margin-bottom: 30px;
  ul {
    display: flex;
    column-gap: 10px;
    align-items: center;
  }
`;
