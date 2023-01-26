interface Modal {
  type: ModalTypes;
  id: number;
  show: boolean;
  msg: string;
  ms: number;
}

type ModalTypes = "error" | "success";

export type { Modal, ModalTypes };
