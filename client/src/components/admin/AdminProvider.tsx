import axios, { AxiosError } from "axios";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { auth } from "../../utils/firebaseConfig";
import Navigation from "./Navigation";

const baseUrl = import.meta.env.VITE_APP_BASE_URL || "http://localhost:3000";

type ContextType = {
  admin: User | null;
};

const AppContext = createContext<ContextType>({
  admin: null,
});

export default function AdminProvider() {
  const [admin, setAdmin] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribeAuthStateChanged = onAuthStateChanged(auth, (user) => {
      setAdmin(user);
    });
    return () => {
      unsubscribeAuthStateChanged();
    };
  }, []);

  useEffect(() => {
    if (admin) {
      admin.getIdToken().then(async (token) => {
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
          if (!admin) await signOut(auth);
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
  }, [admin]);

  return (
    <AppContext.Provider value={{ admin }}>
      <Navigation />
      <Outlet />
    </AppContext.Provider>
  );
}

export function useAdmin() {
  return useContext<ContextType>(AppContext);
}
