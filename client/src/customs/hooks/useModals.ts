import { useState, useCallback } from "react";
import { Modal } from "../../interfaces/Modal";

export default function useModals() {
  const [modals, setModals] = useState<Modal[]>([]);

  const addModal = useCallback((modal: Modal) => {
    setModals((prev) => [...prev, modal]);
  }, []);

  const handleModal = useCallback((modal: Modal) => {
    const { id } = modal;
    setModals((prev) =>
      prev.map((_) => {
        if (_.id === id) return modal;
        return _;
      })
    );
  }, []);

  return {
    modals,
    addModal,
    handleModal,
  };
}
