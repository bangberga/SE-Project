import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { RiDeleteBin6Line } from "react-icons/ri";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { FilteredCart } from "../../interfaces/Cart";
import { useUserContext } from "../context/UserProvider";
import { useProductsContext } from "./ProductsProvider";
import Checkout from "../../pages/client/Checkout";
import ImageGallery from "../ImageGallery";
import useUser from "../../customs/hooks/useUser";

const baseUrl = import.meta.env.VITE_APP_BASE_URL || "http://localhost:3000";

export default function CartItem({ cartItem }: { cartItem: FilteredCart }) {
  const { addToCart, deleteFromCart } = useProductsContext();
  const { user: client } = useUserContext();
  const { owner, cart, totalPrice } = cartItem;
  const { user } = useUser(`${baseUrl}/api/v1/auth/getUser?uid=${owner}`);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <Card>
        {user ? (
          <header className="owner-info">
            <LazyLoadImage
              src={
                user.photoURL ? user.photoURL : "/default profile picture.jpg"
              }
              placeholderSrc={
                user.photoURL ? user.photoURL : "/default profile picture.jpg"
              }
              alt="photo"
              effect="blur"
            />
            <p>{user.email}</p>
          </header>
        ) : (
          ""
        )}
        <div className="cart-section">
          <div className="row">
            <p className="item">Item</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Subtotal</p>
            <p></p>
          </div>
          <hr />
          <div className="cart-container">
            {cart.map((fruit) => {
              const { _id, image, name, price, quantity, purchaseQuantity } =
                fruit;
              return (
                <article key={_id} className="cart-item">
                  <div className="item">
                    <ImageGallery
                      second={4}
                      images={image.map((url) => (
                        <LazyLoadImage
                          src={url}
                          placeholderSrc={url}
                          alt="photo"
                          className="cart-img"
                          effect="blur"
                        />
                      ))}
                    />
                    <h4>{name}</h4>
                  </div>
                  <p className="price">${price}</p>
                  <div className="quantity">
                    <button
                      onClick={() => {
                        if (purchaseQuantity <= 1) return;
                        addToCart({
                          ...fruit,
                          purchaseQuantity: -1,
                        });
                      }}
                    >
                      -
                    </button>
                    <p>{purchaseQuantity}</p>
                    <button
                      onClick={() => {
                        if (purchaseQuantity === quantity) return;
                        addToCart({
                          ...fruit,
                          purchaseQuantity: 1,
                        });
                      }}
                    >
                      +
                    </button>
                  </div>
                  <p className="price">
                    ${Number((purchaseQuantity * price).toFixed(2))}
                  </p>
                  <div className="btn-container">
                    <button
                      className="delete-btn"
                      onClick={() => deleteFromCart(_id)}
                    >
                      <RiDeleteBin6Line />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
          <hr />
          <div className="row">
            <p></p>
            <p></p>
            <p></p>
            <p className="total">Total: ${totalPrice}</p>
            <p></p>
          </div>
        </div>
        <footer className="btn-container">
          {client ? (
            <span className="btn-primary" onClick={handleOpen}>
              Checkout
            </span>
          ) : (
            <Link to="/login" className="btn-primary">
              Login
            </Link>
          )}
        </footer>
      </Card>
      {isOpen ? (
        <Checkout filteredCart={cartItem} handleClose={handleClose} />
      ) : (
        ""
      )}
    </>
  );
}

const Card = styled.article`
  --cartItemBorderRadius: 10px;
  background: var(--mainWhite);
  padding: 10px;
  margin: 20px 0;
  border-radius: var(--cartItemBorderRadius);
  p {
    margin: 0;
  }
  .owner-info {
    display: flex;
    align-items: center;
    column-gap: 10px;
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }
    p {
      font-weight: bold;
    }
  }
  .cart-section {
    margin: 5px;
    padding: 5px;
    border-radius: var(--mainBorderRadius);
    transition: var(--mainTransition);
    hr {
      margin: 10px 0;
    }
    .row {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      .item {
        width: 200px;
      }
      p {
        text-align: center;
      }
    }
  }
  .cart-item {
    margin: 10px 0;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    .item {
      display: flex;
      align-items: center;
      column-gap: 10px;
      width: 200px;
      .cart-img {
        width: 100px;
        height: 75px;
        object-fit: cover;
        border-radius: var(--mainBorderRadius);
      }
      h4 {
        text-transform: capitalize;
        letter-spacing: 0;
        margin: 0;
      }
    }
    .price {
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--primaryColor);
    }
    .quantity {
      display: flex;
      align-items: center;
      justify-content: center;
      column-gap: 10px;
      color: var(--primaryColor);
      button {
        width: 20px;
        height: 20px;
        font-size: larger;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        background: var(--primaryLightColor);
        border: none;
        border-radius: 50%;
        color: var(--primaryColor);
      }
    }
    .btn-container {
      margin: 0;
      justify-content: center;
      align-items: center;
      .delete-btn {
        width: 20px;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: none;
        background: var(--mainRed);
        border-radius: var(--mainBorderRadius);
        color: var(--mainWhite);
        cursor: pointer;
      }
    }
  }
  .btn-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
`;
