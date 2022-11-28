import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import PageLoading from "./components/PageLoading";

const ClientLogin = lazy(() => import("./pages/client/Login"));
const ClientRegister = lazy(() => import("./pages/client/Register"));
const ClientHome = lazy(() => import("./pages/client/Home"));
const Cart = lazy(() => import("./pages/client/Cart"));
const Products = lazy(() => import("./pages/client/Products"));
const AdminHome = lazy(() => import("./pages/admin/Home"));
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminRegister = lazy(() => import("./pages/admin/Register"));
const Stock = lazy(() => import("./pages/admin/Stock"));
const EditFruit = lazy(() => import("./pages/admin/EditFruit"));
const PostFruit = lazy(() => import("./pages/admin/PostFruit"));
const NotFound = lazy(() => import("./pages/NotFound"));

const StockProvider = lazy(() => import("./components/admin/StockProvider"));
const ProductsProvider = lazy(
  () => import("./components/client/ProductsProvider")
);
const ClientNavigateRoute = lazy(
  () => import("./components/client/NavigateRoute")
);
const AdminNavigateRoute = lazy(
  () => import("./components/admin/NavigateRoute")
);
const AdminProtectedRoute = lazy(
  () => import("./components/admin/ProtectedRoute")
);
const ClientProvider = lazy(() => import("./components/client/ClientProvider"));
const AdminProvider = lazy(() => import("./components/admin/AdminProvider"));

export default function App() {
  return (
    <main>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/" element={<ClientProvider />}>
            <Route index element={<ClientHome />} />
            <Route path="register" element={<ClientRegister />} />
            <Route element={<ClientNavigateRoute />}>
              <Route path="login" element={<ClientLogin />} />
            </Route>
            <Route path="products" element={<ProductsProvider />}>
              <Route index element={<Products />} />
              <Route path="cart" element={<Cart />}></Route>
            </Route>
          </Route>
          <Route path="/admin" element={<AdminProvider />}>
            <Route index element={<AdminHome />} />
            <Route path="register" element={<AdminRegister />} />
            <Route element={<AdminNavigateRoute />}>
              <Route path="login" element={<AdminLogin />} />
            </Route>
            <Route element={<AdminProtectedRoute />}>
              <Route path="stock" element={<StockProvider />}>
                <Route index element={<Stock />} />
                <Route path="new" element={<PostFruit />} />
                <Route path="edit/:id" element={<EditFruit />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </main>
  );
}
