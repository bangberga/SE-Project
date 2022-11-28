import { Dna } from "react-loader-spinner";
import styled from "styled-components";

export default function LazyLoading() {
  return (
    <Wrapper>
      <Dna
        visible={true}
        height={120}
        width={120}
        ariaLabel="dna-loading"
        wrapperStyle={{}}
        wrapperClass="dna-wrapper"
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
  background-color: #fff;
`;
