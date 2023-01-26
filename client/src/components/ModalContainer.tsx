import styled from "styled-components";
import Modal from "./Modal";
import { useUserContext } from "./context/UserProvider";

export default function ModalContainer() {
  const { modals } = useUserContext();

  return (
    <ModalContainerSection>
      {modals.map((modal) => (
        <Modal key={modal.id} modal={modal} />
      ))}
    </ModalContainerSection>
  );
}

const ModalContainerSection = styled.div`
  position: fixed;
  right: 0;
  bottom: 0;
  display: grid;
  row-gap: 10px;
  padding: 10px;
  justify-content: center;
  z-index: 100;
`;
