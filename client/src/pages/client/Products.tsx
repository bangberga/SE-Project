import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { setCookie } from "../../utils/cookie";

function Products() {
  useEffect(() => {
    setCookie("navigateUrl", "/products", 365);
  }, []);
  return <div>Products</div>;
}

export default Products;
