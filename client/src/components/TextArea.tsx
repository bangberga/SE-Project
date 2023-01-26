import { ForwardedRef, TextareaHTMLAttributes, forwardRef, useId } from "react";
import styled from "styled-components";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export default forwardRef(function TextArea(
  props: TextAreaProps,
  ref?: ForwardedRef<HTMLTextAreaElement>
) {
  const { label } = props;
  const id = useId();

  return (
    <TextAreaSection>
      <label htmlFor={id}>{label}</label>
      <div>
        <textarea id={id} {...props} ref={ref}></textarea>
      </div>
    </TextAreaSection>
  );
});

const TextAreaSection = styled.div`
  label {
    font-weight: bold;
    color: var(--primaryColor);
    display: block;
  }
  textarea {
    width: 100%;
    height: 50px;
    resize: none;
    padding: 5px;
  }
`;
