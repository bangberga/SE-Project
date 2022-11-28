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
} from "../../utils/localstorage";

const baseUrl = import.meta.env.VITE_APP_BASE_URL || "http://localhost:3000";

type IProductsContext = {
  fruits: FruitRes[];
  cart: CartItem[];
  addToCart: (fruit: CartItem) => void;
  deleteFromCart: (id: string) => void;
  deleteFromCartByOwner: (ownerId: string) => void;
  loading: boolean;
  handleSearchQuery: (e: ChangeEvent<HTMLInputElement>) => void;
};

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
  const [fruits, setFruits] = useState<FruitRes[]>([]);
  const [cart, setCart] = useState<CartItem[]>(getCartFromLocalStorage());
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useSearchParams();
  const location = useLocation();

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
    setFruits((prev) => [...prev, fruit]);
  }, []);

  const updateFruits = useCallback(
    ({ _id, fields }: { _id: string; fields: any }) => {
      setFruits((prev) =>
        prev.map((fruit) =>
          fruit._id === _id ? { ...fruit, ...fields } : fruit
        )
      );
      setCart((prev) =>
        (
          prev.map((item) => {
            if (item._id !== _id) return item;
            const newItem = { ...item, ...fields };
            const { quantity } = fields;
            if (quantity !== undefined && typeof quantity === "number")
              if (quantity < newItem.purchaseQuantity)
                newItem.purchaseQuantity = quantity;
            return newItem;
          }) as CartItem[]
        ).filter((item) => item.quantity !== 0)
      );
    },
    []
  );

  const deleteFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  }, []);

  const deleteFromCartByOwner = useCallback((ownerId: string) => {
    setCart((prev) => prev.filter((item) => item.owner !== ownerId));
  }, []);

  const deleteFruit = useCallback((id: string) => {
    setFruits((prev) => prev.filter((fruit) => fruit._id !== id));
    deleteFromCart(id);
  }, []);

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

  useEffect(() => {
    const query = decodeURIComponent(location.search);
    const controller = new AbortController();
    setLoading(true);
    axios
      .get(`${baseUrl}/api/v1/fruits${query}`, {
        signal: controller.signal,
      })
      .then((response) => {
        setFruits(response.data.fruits);
      })
      .catch((error) => {
        // handle error
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [location]);

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

export function useProducts() {
  return useContext<IProductsContext>(ProductsContext);
}
