import axios, { AxiosError } from "axios";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { auth } from "../../utils/firebaseConfig";
import Navigation from "./Navigation";

const baseUrl = import.meta.env.VITE_APP_BASE_URL || "http://localhost:3000";

type ContextType = {
  client: User | null;
};

const AppContext = createContext<ContextType>({
  client: null,
});

export default function ClientProvider() {
  const [client, setClient] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribeAuthStateChanged = onAuthStateChanged(auth, (user) => {
      setClient(user);
    });
    return () => {
      unsubscribeAuthStateChanged();
    };
  }, []);

  useEffect(() => {
    if (client) {
      client.getIdToken().then(async (token) => {
        try {
          const {
            data: { admin },
          }: { data: { admin: boolean } } = await axios.get(
            `${baseUrl}/api/v1/auth/role`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (admin) signOut(auth);
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
  }, [client]);

  return (
    <>
      <AppContext.Provider value={{ client }}>
        <Navigation />
        <Outlet />
      </AppContext.Provider>
    </>
  );
}

export function useClient() {
  return useContext(AppContext);
}
