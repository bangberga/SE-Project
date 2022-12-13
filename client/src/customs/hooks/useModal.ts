import { useState, useEffect, useCallback } from "react";
import { Modal } from "../../interfaces/Modal";

export default function useModal(): [Modal, (modal: Modal) => void] {
  const [modal, setModal] = useState<Modal>({ show: false, msg: "" });

  const handleModal = useCallback((modal: Modal) => {
    setModal(modal);
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (modal.show) {
      timeout = setTimeout(() => {
        setModal((prev) => ({ ...prev, show: false }));
      }, 4000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [modal.show]);

  return [modal, handleModal];
}
