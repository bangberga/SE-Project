import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../../utils/firebaseConfig";
import axios, { AxiosError } from "axios";

export default function useAuth(url: string, role: string) {
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
          const { data } = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (data.role !== role) await signOut(auth);
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
  }, [user, url, role]);

  return { loading, user };
}
