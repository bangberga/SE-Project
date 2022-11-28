import styled from "styled-components";

export default function NotFound() {
  return (
    <Wrapper>
      <h1>404</h1>
      <p>Ooops! Page not found</p>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  min-width: 300px;
  padding: 15px 30px;
  background: var(--mainWhite);
  width: fit-content;
  box-shadow: var(--darkShadow);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
