import { useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { RotatingLines } from "react-loader-spinner";
import { setCookie } from "../../utils/cookie";
import SearchBar from "../../components/SearchBar";
import { useProducts } from "../../components/client/ProductsProvider";
import Fruit from "../../components/client/Fruit";

function Products() {
  const { loading, fruits, cart } = useProducts();

  useEffect(() => {
    setCookie("navigateClientUrl", "/products", 365);
  }, []);

  return (
    <Wrapper>
      <h2 className="title">Fruits</h2>
      <div className="underline"></div>
      <SearchBar />
      <div className="cart-link">
        <span className="number">{cart.length}</span>
        <Link to="/products/cart">
          <AiOutlineShoppingCart /> Cart
        </Link>
      </div>
      {loading ? (
        <div>
          <div className="loading-container">
            <RotatingLines
              strokeColor="#476a2e"
              strokeWidth="5"
              animationDuration="0.75"
              width="96"
              visible={true}
            />
          </div>
        </div>
      ) : (
        <div className="fruits-container">
          {fruits.length === 0 ? (
            <p className="warning">No fruit matches!</p>
          ) : (
            fruits.map((fruit) => <Fruit key={fruit._id} fruit={fruit} />)
          )}
        </div>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.section`
  margin: 0 2rem;
  .title {
    margin: 10px 0;
    text-align: center;
    color: var(--primaryColor);
  }
  .fruits-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
    gap: 20px 20px;
    .warning {
      color: var(--mainRed);
    }
  }
  .loading-container {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .cart-link {
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-end;
    position: relative;
    a {
      display: flex;
      align-items: center;
      column-gap: 5px;
      background: var(--primaryColor);
      color: var(--mainWhite);
      text-transform: uppercase;
      padding: 0 10px;
      border-radius: var(--mainBorderRadius);
    }
    .number {
      position: absolute;
      font-size: small;
      font-weight: bold;
      border-radius: 50%;
      color: var(--mainWhite);
      background-color: var(--mainRed);
      top: -10px;
      right: -10px;
      width: 20px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`;

export default Products;
