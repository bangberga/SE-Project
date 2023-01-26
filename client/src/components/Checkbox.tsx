import { ChangeEvent, InputHTMLAttributes, useId } from "react";
import styled from "styled-components";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  lable: string;
}

export default function Checkbox(props: CheckboxProps) {
  const { lable } = props;
  const id = useId();

  return (
    <CheckboxSection>
      <div className="checkbox">
        <input {...props} id={id} className="switch-input" type="checkbox" />
        <label htmlFor={id} className="switch"></label>
      </div>
      <span>{lable}</span>
    </CheckboxSection>
  );
}

const CheckboxSection = styled.div`
  display: flex;
  align-items: center;
  span {
    margin-left: 10px;
  }
  .checkbox {
    margin: 0;
    .switch-input {
      display: none;
      :checked + .switch {
        background-color: var(--primaryColor);
        border-color: var(--primaryColor);
        ::before {
          left: 100%;
          transform: translateX(-100%);
        }
      }
    }
    .switch {
      --switch-width: 40px;
      --switch-height: calc(var(--switch-width) / 2);
      --switch-border: calc(var(--switch-height) / 10);
      --switch-thumb-size: calc(
        var(--switch-height) - var(--switch-border) * 2
      );
      --switch-width-inside: calc(
        var(--switch-width) - var(--switch-border) * 2
      );
      display: block;
      box-sizing: border-box;
      width: var(--switch-width);
      height: var(--switch-height);
      border: var(--switch-border) solid var(--primaryLightColor);
      border-radius: var(--switch-height);
      background-color: var(--primaryLightColor);
      cursor: pointer;
      margin: var(--switch-margin) 0;
      transition: 300ms 100ms;

      position: relative;

      ::before {
        content: "";
        background-color: var(--mainWhite);
        height: var(--switch-thumb-size);
        width: var(--switch-thumb-size);
        border-radius: var(--switch-thumb-size);

        position: absolute;
        top: 0;
        left: 0;

        transition: 300ms, width 600ms;
      }

      :active::before {
        width: 80%;
      }
    }
  }
`;
