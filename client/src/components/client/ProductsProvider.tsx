import axios from "axios";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ChangeEvent,
} from "react";
import { Outlet, useLocation, useSearchParams } from "react-router-dom";
import Pusher from "pusher-js";
import { FruitRes } from "../../interfaces/Fruit";
import { CartItem } from "../../interfaces/Cart";
import {
  getCartFromLocalStorage,
  setNewCartFromLocalStorage,
} from "../../utils/localStorage";
import useFruits from "../../customs/hooks/useFruits";

const baseUrl = import.meta.env.VITE_APP_BASE_URL || "http://localhost:3000";

interface IProductsContext {
  fruits: FruitRes[];
  loading: boolean;
  cart: CartItem[];
  addToCart: (fruit: CartItem) => void;
  deleteFromCart: (id: string) => void;
  deleteFromCartByOwner: (ownerId: string) => void;
  handleSearchQuery: (e: ChangeEvent<HTMLInputElement>) => void;
}

const ProductsContext = createContext<IProductsContext>({
  fruits: [],
  cart: getCartFromLocalStorage(),
  addToCart: () => {},
  deleteFromCart: () => {},
  deleteFromCartByOwner: () => {},
  loading: false,
  handleSearchQuery: (e) => {},
});

export default function ProductsProvider() {
  const location = useLocation();
  const { loading, fruits, handleFruits } = useFruits(
    `${baseUrl}/api/v1/fruits${decodeURIComponent(location.search)}`
  );
  const [cart, setCart] = useState<CartItem[]>(getCartFromLocalStorage());
  const [query, setQuery] = useSearchParams();

  const handleSearchQuery = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const name = e.target.name;
      const value = e.target.value;
      if (value) {
        query.set(name, value);
        setQuery(query);
      } else {
        query.delete(name);
        setQuery(query);
      }
    },
    [query]
  );

  const addFruits = useCallback((fruit: FruitRes) => {
    handleFruits([...fruits, fruit]);
  }, []);

  const updateFromCart = useCallback((id: string, fields: any) => {
    setCart((prev) =>
      (
        prev.map((item) => {
          if (item._id !== id) return item;
          const newItem = { ...item, ...fields };
          const { quantity } = fields;
          if (quantity !== undefined && typeof quantity === "number")
            if (quantity < newItem.purchaseQuantity)
              newItem.purchaseQuantity = quantity;
          return newItem;
        }) as CartItem[]
      ).filter((item) => item.quantity !== 0)
    );
  }, []);

  const updateFruits = useCallback(
    ({ _id, fields }: { _id: string; fields: any }) => {
      handleFruits(
        fruits.map((fruit) =>
          fruit._id === _id ? { ...fruit, ...fields } : fruit
        )
      );
      updateFromCart(_id, fields);
    },
    [updateFromCart]
  );

  const deleteFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  }, []);

  const deleteFromCartByOwner = useCallback((ownerId: string) => {
    setCart((prev) => prev.filter((item) => item.owner !== ownerId));
  }, []);

  const deleteFruit = useCallback(
    (id: string) => {
      handleFruits(fruits.filter((fruit) => fruit._id !== id));
      deleteFromCart(id);
    },
    [deleteFromCart]
  );

  useEffect(() => {
    const pusher = new Pusher(import.meta.env.VITE_APP_PUSHER_KEY, {
      cluster: import.meta.env.VITE_APP_PUSHER_CLUSTER,
    });
    const channel = pusher.subscribe("fruits");
    channel.bind("insert fruit", addFruits);
    channel.bind("delete fruit", deleteFruit);
    channel.bind("update fruit", updateFruits);
    return () => {
      pusher.unsubscribe("fruits");
    };
  }, []);

  const addToCart = useCallback(
    (newFruit: CartItem) => {
      const { _id } = newFruit;
      const fruit = cart.find((item) => item._id === _id);
      if (!fruit) return setCart((prev) => [...prev, newFruit]);
      const newQuantity = fruit.purchaseQuantity + newFruit.purchaseQuantity;
      fruit.purchaseQuantity =
        newQuantity >= fruit.quantity ? fruit.quantity : newQuantity;
      setCart((prev) => prev.map((item) => (item._id === _id ? fruit : item)));
    },
    [cart]
  );

  useEffect(() => {
    setNewCartFromLocalStorage(cart);
  }, [cart]);

  return (
    <ProductsContext.Provider
      value={{
        fruits,
        cart,
        addToCart,
        deleteFromCart,
        deleteFromCartByOwner,
        loading,
        handleSearchQuery,
      }}
    >
      <Outlet />
    </ProductsContext.Provider>
  );
}

export function useProductsContext() {
  return useContext<IProductsContext>(ProductsContext);
}
