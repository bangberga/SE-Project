import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "./utils/firebaseConfig";
import {
  createContext,
  useState,
  useEffect,
  Suspense,
  lazy,
  useContext,
} from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import GlobalContext from "./interfaces/GlobalContext";

const Login = lazy(() => import("./pages/Login"));

const AppProvider = createContext<GlobalContext>({
  user: null,
  setUser: () => {},
});

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribeAuthStateChanged = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => {
      unsubscribeAuthStateChanged();
    };
  }, []);

  return (
    <BrowserRouter>
      <AppProvider.Provider value={{ user, setUser }}>
        <main>
          <Suspense fallback={<h1>Loading...</h1>}>
            <Routes>
              <Route path="/">
                <Route path="login" element={<Login />} />
              </Route>
            </Routes>
          </Suspense>
        </main>
      </AppProvider.Provider>
    </BrowserRouter>
  );
}

export function useGlobalContext() {
  return useContext(AppProvider);
}
