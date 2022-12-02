import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import PageLoading from "./components/PageLoading";

const ClientLogin = lazy(() => import("./pages/client/Login"));
const ClientRegister = lazy(() => import("./pages/client/Register"));
const ClientResetPassword = lazy(() => import("./pages/client/ResetPassword"));
const ClientHome = lazy(() => import("./pages/client/Home"));
const Cart = lazy(() => import("./pages/client/Cart"));
const Products = lazy(() => import("./pages/client/Products"));
const AdminHome = lazy(() => import("./pages/admin/Home"));
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminRegister = lazy(() => import("./pages/admin/Register"));
const AdminResetPassword = lazy(() => import("./pages/admin/ResetPassword"));
const Stock = lazy(() => import("./pages/admin/Stock"));
const EditFruit = lazy(() => import("./pages/admin/EditFruit"));
const PostFruit = lazy(() => import("./pages/admin/PostFruit"));
const Transactions = lazy(() => import("./pages/admin/Transactions"));
const NotFound = lazy(() => import("./pages/NotFound"));

const ClientProvider = lazy(() => import("./components/client/ClientProvider"));
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
const AdminProvider = lazy(() => import("./components/admin/AdminProvider"));
const StockProvider = lazy(() => import("./components/admin/StockProvider"));
const TransactionProvider = lazy(
  () => import("./components/admin/TransactionProvider")
);
const ResetPassword = lazy(() => import("./components/ResetPasswordForm"));

export default function App() {
  return (
    <main>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/" element={<ClientProvider />}>
            <Route index element={<ClientHome />} />
            <Route path="register" element={<ClientRegister />} />
            <Route path="forgotpassword" element={<ClientResetPassword />} />
            <Route element={<ClientNavigateRoute />}>
              <Route path="login" element={<ClientLogin />} />
            </Route>
            <Route path="products" element={<ProductsProvider />}>
              <Route index element={<Products />} />
              <Route path="cart" element={<Cart />} />
            </Route>
          </Route>
          <Route path="/admin" element={<AdminProvider />}>
            <Route index element={<AdminHome />} />
            <Route path="register" element={<AdminRegister />} />
            <Route path="forgotpassword" element={<AdminResetPassword />} />
            <Route element={<AdminNavigateRoute />}>
              <Route path="login" element={<AdminLogin />} />
            </Route>
            <Route element={<AdminProtectedRoute />}>
              <Route path="stock" element={<StockProvider />}>
                <Route index element={<Stock />} />
                <Route path="new" element={<PostFruit />} />
                <Route path="edit/:id" element={<EditFruit />} />
              </Route>
              <Route path="transactions" element={<TransactionProvider />}>
                <Route index element={<Transactions />} />
              </Route>
            </Route>
          </Route>
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </main>
  );
}
