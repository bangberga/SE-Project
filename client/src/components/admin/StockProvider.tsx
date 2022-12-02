import axios, { AxiosError } from "axios";
import Pusher from "pusher-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Outlet } from "react-router-dom";
import { useAdmin } from "./AdminProvider";
import { FruitRes } from "../../interfaces/Fruit";
import { deleteImages } from "../../utils/storage";

const baseUrl = import.meta.env.VITE_APP_BASE_URL || "http://localhost:3000";

type IStockContext = {
  fruits: FruitRes[];
  loading: boolean;
  handleDeleteFruit: (id: string) => Promise<void>;
};

const StockContext = createContext<IStockContext>({
  fruits: [],
  loading: false,
  handleDeleteFruit: (id) => Promise.resolve(),
});

export default function Stock() {
  const { admin } = useAdmin();
  const [fruits, setFruits] = useState<FruitRes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchFruits = useCallback(async () => {
    if (!admin) return;
    setLoading(true);
    try {
      const {
        data: { fruits },
      }: { data: { fruits: FruitRes[] } } = await axios.get(
        `${baseUrl}/api/v1/fruits?owner=${admin.uid}`
      );
      setFruits(fruits);
    } catch (error) {
      const err = error as AxiosError;
      if (err.status === 404) {
        // handle error not found
      }
    } finally {
      setLoading(false);
    }
  }, [admin]);

  const handleDeleteFruit = useCallback(
    async (id: string) => {
      if (!admin) return;
      try {
        const {
          data: { deletedFruit },
        }: { data: { deletedFruit: FruitRes } } = await axios.delete(
          `${baseUrl}/api/v1/fruits/${id}`,
          {
            headers: {
              Authorization: `Bearer ${await admin.getIdToken()}`,
            },
          }
        );
        await deleteImages(
          deletedFruit.image.filter(
            (imgUrl) => imgUrl !== "/unavailable image.jpg"
          )
        );
      } catch (error) {
        const err = error as AxiosError;
        if (err.status === 404) {
          // handle error not found
        }
      }
    },
    [admin]
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
    },
    []
  );

  const deleteFruit = useCallback((id: string) => {
    setFruits((prev) => prev.filter((fruit) => fruit._id !== id));
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
  }, [addFruits, deleteFruit, updateFruits]);

  useEffect(() => {
    fetchFruits();
  }, [fetchFruits]);

  return (
    <StockContext.Provider value={{ fruits, loading, handleDeleteFruit }}>
      <Outlet />
    </StockContext.Provider>
  );
}

export function useStock() {
  return useContext<IStockContext>(StockContext);
}
