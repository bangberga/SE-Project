import styled from "styled-components";
import { IconType } from "react-icons";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: IconType;
  children: ReactNode;
}

export default function Button(props: ButtonProps) {
  const { icon, children, ...restProps } = props;
  return (
    <ButtonSection {...restProps}>
      {icon && icon({})}
      {children}
    </ButtonSection>
  );
}

const ButtonSection = styled.button`
  width: 100%;
  display: flex;
  justify-content: center;
  align-self: center;
  column-gap: 10px;
  text-transform: uppercase;
  border: none;
  font-size: 0.8rem;
  padding: 0.45rem 0.8rem;
  cursor: pointer;
  border-radius: var(--mainBorderRadius);
  transition: var(--mainTransition);
  letter-spacing: var(--mainSpacing);
`;
