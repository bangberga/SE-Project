import styled from "styled-components";

interface PasswordLevelProps {
  level: string | null;
}

export default function PasswordLevel(props: PasswordLevelProps) {
  const { level } = props;

  return level ? (
    <PasswordLevelSection>
      Password level: <span className={level.toLowerCase()}>{level}</span>
    </PasswordLevelSection>
  ) : (
    <></>
  );
}

const PasswordLevelSection = styled.p`
  .weak,
  .medium,
  .strong {
    font-weight: bold;
  }
  .weak {
    color: var(--mainRed);
  }
  .medium {
    color: var(--mainOrange);
  }
  .strong {
    color: var(--mainGreen);
  }
`;
