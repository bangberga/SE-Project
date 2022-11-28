import { useEffect, useMemo, createContext } from "react";
import styled from "styled-components";
import { useProducts } from "../../components/client/ProductsProvider";
import CartFruit from "../../components/client/CartFruit";
import filterCartByOwner from "../../utils/filterCartByOwner";
import { setCookie } from "../../utils/cookie";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart } = useProducts();
  const filtered = useMemo(() => filterCartByOwner(cart), [cart]);

  useEffect(() => {
    setCookie("navigateClientUrl", "/products/cart", 365);
  }, []);

  return (
    <Wrapper>
      <h2 className="title">Your cart</h2>
      <div className="underline"></div>
      {filtered.length === 0 ? (
        <>
          <h1 className="warning">Your cart is empty!</h1>
          <Link to="/products" className="btn-primary center">
            fill it
          </Link>
        </>
      ) : (
        <div className="items-container">
          {filtered.map((filteredCart) => (
            <CartFruit key={filteredCart.owner} filteredCart={filteredCart} />
          ))}
        </div>
      )}
      <Link to="/products" className="btn right">
        Continue to shopping
      </Link>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  margin: 0 2rem;
  padding: 2rem 0;
  .title {
    margin: 0;
    text-align: center;
    color: var(--primaryColor);
  }
  .warning {
    text-align: center;
  }
  .btn-primary {
    width: max-content;
    display: block;
  }
  .btn-primary.center {
    margin: auto;
  }
  .btn {
    font-weight: bolder;
    display: block;
    width: max-content;
  }
  .btn.right {
    margin-left: auto;
  }
`;
