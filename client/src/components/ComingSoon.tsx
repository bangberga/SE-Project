import styled from "styled-components";
import { LazyLoadImage } from "react-lazy-load-image-component";

export default function ComingSoon() {
  return (
    <Wrapper>
      <LazyLoadImage
        src="/plane.png"
        placeholderSrc="/plane.png"
        effect="blur"
        alt="plane"
      />
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
