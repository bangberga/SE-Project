import { CartItem } from "../interfaces/Cart";
import _ from "lodash";

export default function filterCartByOwner(cart: CartItem[]) {
  return _.chain(cart)
    .groupBy("owner")
    .map((value, key) => ({
      owner: key,
      cart: value,
      totalPrice: totalPrice(value),
    }))
    .value();
}

function totalPrice(cart: CartItem[]) {
  return _.reduce(
    cart,
    (sum, curr) => {
      return Number((sum + curr.price * curr.purchaseQuantity).toFixed(2));
    },
    0
  );
}
