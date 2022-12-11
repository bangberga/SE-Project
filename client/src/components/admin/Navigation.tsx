import { NavLink } from "react-router-dom";
import { useUser } from "../context/UserProvider";
import styled from "styled-components";
import Logo from "../Logo";
import Avatar from "../Avatar";

export default function Navigation() {
  const { user: admin } = useUser();

  return (
    <Nav>
      <Logo />
      <ul>
        <li>
          <NavLink to="/admin">Home</NavLink>
        </li>
        {admin ? (
          <>
            <li>
              <NavLink to="/admin/stock">My stock</NavLink>
            </li>
            <li>
              <NavLink to="/admin/transactions">My transactions</NavLink>
            </li>
          </>
        ) : (
          ""
        )}
        {admin ? (
          ""
        ) : (
          <li>
            <NavLink to="/admin/register">Register</NavLink>
          </li>
        )}
        <li>
          {admin ? (
            <Avatar src={admin.photoURL} />
          ) : (
            <NavLink to="/admin/login">Login</NavLink>
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
