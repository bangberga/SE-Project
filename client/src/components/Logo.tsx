import styled from "styled-components";

export default function Logo() {
  return (
    <Text>
      The<span className="highlight">Fruit</span>DB
    </Text>
  );
}

const Text = styled.h2`
  letter-spacing: 0.1;
  user-select: none;
  font-weight: 400;
  display: inline-block;
  margin: 0;
  .highlight {
    color: var(--primaryColor);
    font-weight: 800;
  }
`;
