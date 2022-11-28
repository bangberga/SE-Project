import styled from "styled-components";
import { useProducts } from "./client/ProductsProvider";

export default function SearchBar() {
  const { handleSearchQuery } = useProducts();
  return (
    <Wrapper>
      <h3>Search fruits</h3>
      <input
        type="text"
        name="name"
        placeholder="search fruits..."
        onChange={handleSearchQuery}
      />
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
