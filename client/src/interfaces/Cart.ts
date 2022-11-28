import { FruitRes } from "./Fruit";
type CartItem = FruitRes & { purchaseQuantity: number };
type FilteredCart = {
  owner: string;
  cart: CartItem[];
  totalPrice: number;
};

export type { CartItem, FilteredCart };
