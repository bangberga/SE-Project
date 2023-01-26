import { useEffect, useMemo } from "react";
import styled from "styled-components";
import { useProductsContext } from "../../components/client/ProductsProvider";
import CartItem from "../../components/client/CartItem";
import filterCartByOwner from "../../utils/filterCartByOwner";
import { setCookie } from "../../utils/cookie";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart } = useProductsContext();
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
          {filtered.map((item) => (
            <CartItem key={item.owner} cartItem={item} />
          ))}
        </div>
      )}
      {cart.length ? (
        <Link to="/products" className="btn right">
          Continue to shopping
        </Link>
      ) : (
        ""
      )}
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
