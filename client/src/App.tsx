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
import { Route, Routes } from "react-router-dom";
import GlobalContext from "./interfaces/GlobalContext";
import LazyLoading from "./components/client/LazyLoading";

const Login = lazy(() => import("./pages/client/Login"));
const Register = lazy(() => import("./pages/client/Register"));
const Home = lazy(() => import("./pages/client/Home"));
const Checkout = lazy(() => import("./pages/client/Checkout"));
const Cart = lazy(() => import("./pages/client/Cart"));
const Products = lazy(() => import("./pages/client/Products"));
const SingleProduct = lazy(() => import("./pages/client/SingleProduct"));

const Navigation = lazy(() => import("./components/client/Navigation"));
const NavigateRoute = lazy(() => import("./components/client/NavigateRoute"));
const ProtectedRoute = lazy(() => import("./components/client/ProtectedRoute"));

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
    <>
      <AppProvider.Provider value={{ user, setUser }}>
        <Navigation />
        <main>
          <Suspense fallback={<LazyLoading />}>
            <Routes>
              <Route path="/">
                <Route index element={<Home />} />
                <Route path="register" element={<Register />} />
                <Route element={<NavigateRoute />}>
                  <Route path="login" element={<Login />} />
                </Route>
                <Route path="products" element={<Products />} />
                <Route path="products/:id" element={<SingleProduct />} />
                <Route path="cart" element={<Cart />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="checkout" element={<Checkout />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </main>
      </AppProvider.Provider>
    </>
  );
}

export function useGlobalContext() {
  return useContext(AppProvider);
}
