import styled from "styled-components";
import { FcGoogle } from "react-icons/fc";

export default function GoogleLoginButton({
  handle,
  children,
  disabled,
}: {
  handle: () => Promise<void>;
  children: string;
  disabled: boolean;
}) {
  return (
    <Button type="button" onClick={handle} disabled={disabled}>
      <FcGoogle />
      {children}
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-self: center;
  column-gap: 10px;
  text-transform: uppercase;
  background-color: #eee;
  border: none;
  font-size: 0.8rem;
  padding: 0.45rem 0.8rem;
  cursor: pointer;
  border-radius: var(--mainBorderRadius);
  width: 100%;
`;
