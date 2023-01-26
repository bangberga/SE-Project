import { InputHTMLAttributes, useId, forwardRef, ForwardedRef } from "react";
import { IconType } from "react-icons";
import styled from "styled-components";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: IconType;
}

export default forwardRef(function TextInput(
  props: TextInputProps,
  ref?: ForwardedRef<HTMLInputElement>
) {
  const { label, icon, type, ...restProps } = props;
  const id = useId();

  return (
    <InputSection datatype={type}>
      <label htmlFor={id}>{label}</label>
      <div>
        {icon && icon({ className: "icon" })}
        <input id={id} type={type} ref={ref} {...restProps} />
      </div>
    </InputSection>
  );
});

const InputSection = styled.div`
  label {
    font-weight: bold;
    color: var(--primaryColor);
    display: block;
  }
  &[datatype="email"],
  &[datatype="password"],
  &[datatype="number"],
  &[datatype="text"] {
    div {
      display: flex;
      align-items: center;
      background-color: var(--mainBackground);
      border-radius: var(--mainBorderRadius);
      padding: 0 10px;
      color: var(--mainBlack);
      :focus-within {
        outline-color: var(--mainBlack);
        outline-style: solid;
        outline-width: 2px;
      }
      .icon {
        font-size: larger;
        margin-right: 10px;
      }
      input {
        display: block;
        width: 100%;
        height: 40px;
        border: none;
        background-color: var(--mainBackground);
        outline: none;
      }
    }
  }
`;
