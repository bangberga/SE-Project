import { ChangeEvent } from "react";
import styled from "styled-components";

export default function Checkbox({
  handleCheck,
  checked,
}: {
  handleCheck: (e: ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
}) {
  return (
    <Wrapper>
      <input
        id="checkbox"
        className="switch-input"
        type="checkbox"
        onChange={handleCheck}
        checked={checked}
      />
      <label htmlFor="checkbox" className="switch"></label>
    </Wrapper>
  );
}

const Wrapper = styled.div`
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
    --switch-thumb-size: calc(var(--switch-height) - var(--switch-border) * 2);
    --switch-width-inside: calc(var(--switch-width) - var(--switch-border) * 2);
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
`;
