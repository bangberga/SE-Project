import styled from "styled-components";
import Input from "./Input";
import { InputHTMLAttributes } from "react";

interface SearchBar extends InputHTMLAttributes<HTMLInputElement> {}

export default function SearchBar(props: SearchBar) {
  return (
    <Wrapper>
      <h3>Search fruits</h3>
      <Input {...props} type="text" placeholder="search fruits..." />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 20px 30px;
  border-radius: var(--mainBorderRadius);
  background-color: var(--mainWhite);
  margin-bottom: 20px;
  input {
    width: 100%;
    height: 40px;
    background: var(--mainBackground);
    border: none;
    padding: 10px;
  }
`;
