import { CartItem } from "../interfaces/Cart";

const getCartFromLocalStorage = () => {
  let cart = "[]";
  if (localStorage.getItem("cart") !== null)
    cart = localStorage.getItem("cart") as string;
  const parsedCart = JSON.parse(cart);
  return parsedCart;
};

const setNewCartFromLocalStorage = (cart: CartItem[]) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export { getCartFromLocalStorage, setNewCartFromLocalStorage };
