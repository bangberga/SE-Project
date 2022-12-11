import axios, { AxiosError } from "axios";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth } from "../../utils/firebaseConfig";
import PageLoading from "../PageLoading";

const baseUrl = import.meta.env.VITE_APP_BASE_URL || "http://localhost:3000";

interface UserProviderProps {
  role: string;
  children: ReactNode[];
}

interface ContextType {
  user: User | null;
}

const AppContext = createContext<ContextType>({
  user: null,
});

export default function UserProvider(props: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribeAuthStateChanged = onAuthStateChanged(auth, (user) => {
      setUser(user);
      loading && setLoading(false);
    });
    return () => {
      unsubscribeAuthStateChanged();
    };
  }, [loading]);

  useEffect(() => {
    if (user) {
      user.getIdToken().then(async (token) => {
        try {
          const {
            data: { role },
          }: { data: { role: string } } = await axios.get(
            `${baseUrl}/api/v1/auth/role`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (role !== props.role) await signOut(auth);
        } catch (error) {
          const { response } = error as AxiosError;
          if (response && response.data) {
            const data = response.data as {
              err: boolean;
              msg: string;
              statusCode: number;
            };
            if (data.msg === "Must register befrore getting claims")
              return signOut(auth);
          }
          signOut(auth);
        }
      });
    }
  }, [user]);

  if (loading) return <PageLoading />;

  return (
    <AppContext.Provider value={{ user }}>{props.children}</AppContext.Provider>
  );
}

export function useUser() {
  return useContext<ContextType>(AppContext);
}
