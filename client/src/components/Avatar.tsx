import { useCallback, useState } from "react";
import { signOut } from "firebase/auth";
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
      <img
        src={src ? src : "/default profile picture.jpg"}
        className="avatar"
        alt="avatar"
        onClick={handleShow}
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
    width: 40px;
    height: 40px;
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
