import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { lazyLoading } from "./lazyLoading";
import PageLoading from "./components/PageLoading";

const ClientLogin = lazyLoading("./pages/client/Login");
const ClientRegister = lazyLoading("./pages/client/Register");
const ClientResetPassword = lazyLoading("./pages/client/ResetPassword");
const ClientHome = lazyLoading("./pages/client/Home");
const Cart = lazyLoading("./pages/client/Cart");
const Products = lazyLoading("./pages/client/Products");
const AdminHome = lazyLoading("./pages/admin/Home");
const AdminLogin = lazyLoading("./pages/admin/Login");
const AdminRegister = lazyLoading("./pages/admin/Register");
const AdminResetPassword = lazyLoading("./pages/admin/ResetPassword");
const Stock = lazyLoading("./pages/admin/Stock");
const EditFruit = lazyLoading("./pages/admin/EditFruit");
const PostFruit = lazyLoading("./pages/admin/PostFruit");
const Transactions = lazyLoading("./pages/admin/Transactions");
const NotFound = lazyLoading("./pages/NotFound");

const AdminProtectedRoute = lazyLoading("./components/admin/ProtectedRoute");
const AdminNavigateRoute = lazyLoading("./components/admin/NavigateRoute");
const ClientNavigateRoute = lazyLoading("./components/client/NavigateRoute");
const ClientProvider = lazyLoading("./components/client/ClientProvider");
const AdminProvider = lazyLoading("./components/admin/AdminProvider");
const ProductsProvider = lazyLoading("./components/client/ProductsProvider");
const StockProvider = lazyLoading("./components/admin/StockProvider");
const TransactionProvider = lazyLoading(
  "./components/admin/TransactionProvider"
);
const ResetPassword = lazyLoading("./components/ResetPasswordForm");

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
            <Route
              path="resetpassword"
              element={
                <ResetPassword
                  continueUrl={`${window.location.origin}/login`}
                />
              }
            />
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
            <Route
              path="resetpassword"
              element={
                <ResetPassword
                  continueUrl={`${window.location.origin}/admin/login`}
                />
              }
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </main>
  );
}
