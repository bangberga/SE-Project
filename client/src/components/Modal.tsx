import { useEffect } from "react";
import styled from "styled-components";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { Modal as IModal } from "../interfaces/Modal";
import { useUserContext } from "./context/UserProvider";

interface ModalProps {
  modal: IModal;
}

export default function Modal(props: ModalProps) {
  const {
    modal: { type, show, msg, ms },
  } = props;
  const { handleModal } = useUserContext();

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (show) {
      timeout = setTimeout(() => {
        handleModal({ ...props.modal, show: false });
      }, ms);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [show, ms]);

  if (!show) return null;
  return (
    <ModalSection datatype={type}>
      <div className="content">
        <AiOutlineExclamationCircle className="icon" />
        <p>{msg}</p>
      </div>
      <div
        className="timer"
        style={{ animationDuration: `${ms / 1000}s` }}
      ></div>
    </ModalSection>
  );
}

const ModalSection = styled.div`
  background-color: var(--mainWhite);
  border-radius: var(--mainBorderRadius);
  width: 100%;
  .content {
    p {
      margin: 0;
    }
    .icon {
      display: flex;
      align-items: center;
    }
    display: flex;
    align-items: center;
    gap: 0 10px;
    margin: 10px;
  }
  &[datatype="error"] {
    p,
    .icon {
      color: var(--mainRed);
    }
    .timer {
      background-color: var(--mainRed);
    }
  }
  &[datatype="success"] {
    p,
    .icon {
      color: var(--mainGreen);
    }
    .timer {
      background-color: var(--mainGreen);
    }
  }
  @keyframes progress {
    from {
      width: 100%;
    }
    to {
      width: 0;
    }
  }
  .timer {
    height: 4px;
    animation-name: progress;
    animation-iteration-count: 1;
    border-bottom-left-radius: var(--mainBorderRadius);
    border-bottom-right-radius: var(--mainBorderRadius);
  }
`;
