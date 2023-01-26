import { User } from "firebase/auth";
import { createContext, ReactNode, useContext } from "react";
import PageLoading from "../PageLoading";
import useAuth from "../../customs/hooks/useAuth";
import { Modal } from "../../interfaces/Modal";
import useModals from "../../customs/hooks/useModals";

const baseUrl = import.meta.env.VITE_APP_BASE_URL || "http://localhost:3000";

interface UserProviderProps {
  role: string;
  children: ReactNode;
}

interface ContextType {
  user: User | null;
  modals: Modal[];
  addModal: (modal: Modal) => void;
  handleModal: (modal: Modal) => void;
}

const AppContext = createContext<ContextType>({
  user: null,
  modals: [],
  addModal: () => {},
  handleModal: () => {},
});

export default function UserProvider(props: UserProviderProps) {
  const { loading, user } = useAuth(`${baseUrl}/api/v1/auth/role`, props.role);
  const { modals, addModal, handleModal } = useModals();

  if (loading) return <PageLoading />;
  return (
    <AppContext.Provider value={{ user, modals, addModal, handleModal }}>
      {props.children}
    </AppContext.Provider>
  );
}

export function useUserContext() {
  return useContext<ContextType>(AppContext);
}
