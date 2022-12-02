import { useCallback, useState } from "react";
import { signOut } from "firebase/auth";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { auth } from "../utils/firebaseConfig";

import styled from "styled-components";

export default function Avatar({ src }: { src: string | null }) {
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleShow = useCallback(() => {
    setShowModal((prev) => !prev);
  }, []);

  const logOut = useCallback(async () => {
    await signOut(auth);
  }, []);

  return (
    <Wrapper>
      <LazyLoadImage
        src={src ? src : "/default profile picture.jpg"}
        placeholderSrc={src ? src : "/default profile picture.jpg"}
        className="avatar"
        onClick={handleShow}
        width={40}
        height={40}
        effect="blur"
      />
      {showModal ? (
        <div className="modal">
          <span onClick={logOut}>Log out</span>
        </div>
      ) : (
        ""
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  margin: 0;
  .avatar {
    border-radius: 50%;
    object-fit: cover;
    cursor: pointer;
    position: relative;
  }
  .modal {
    position: absolute;
    top: 110%;
    left: 0;
    background-color: var(--mainGrey);
    border-radius: var(--mainBorderRadius);
    padding: 5px 10px;
    width: max-content;
    border: 1px solid var(--mainBlack);
    display: flex;
    flex-direction: column;
    margin: 0;
  }
  .modal span {
    cursor: pointer;
  }
`;
