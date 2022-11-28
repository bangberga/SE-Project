import styled from "styled-components";

export default function ComingSoon() {
  return (
    <Wrapper>
      <img src="/plane.png" alt="plane" />
      <h2>Coming Soon...</h2>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    width: 300px;
  }
`;
