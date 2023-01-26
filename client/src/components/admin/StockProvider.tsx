import axios, { AxiosError } from "axios";
import Pusher from "pusher-js";
import { createContext, useCallback, useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import useFruits from "../../customs/hooks/useFruits";
import { useUserContext } from "../context/UserProvider";
import { FruitRes } from "../../interfaces/Fruit";
import { deleteImages } from "../../utils/storage";

const baseUrl = import.meta.env.VITE_APP_BASE_URL || "http://localhost:3000";

interface IStockContext {
  fruits: FruitRes[];
  loading: boolean;
  handleDeleteFruit: (id: string) => Promise<void>;
}

const StockContext = createContext<IStockContext>({
  fruits: [],
  loading: false,
  handleDeleteFruit: (id) => Promise.resolve(),
});

export default function StockProvider() {
  const { user: admin } = useUserContext();
  const { fruits, loading, handleFruits } = useFruits(
    `${baseUrl}/api/v1/fruits?owner=${admin && admin.uid}`
  );

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

  const addFruits = useCallback(
    (fruit: FruitRes) => {
      if (admin && fruit.owner !== admin.uid) return;
      handleFruits([...fruits, fruit]);
    },
    [admin]
  );

  const updateFruits = useCallback(
    ({ _id, fields }: { _id: string; fields: any }) => {
      handleFruits(
        fruits.map((fruit) =>
          fruit._id === _id ? { ...fruit, ...fields } : fruit
        )
      );
    },
    []
  );

  const deleteFruit = useCallback((id: string) => {
    handleFruits(fruits.filter((fruit) => fruit._id !== id));
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

  return (
    <StockContext.Provider value={{ fruits, loading, handleDeleteFruit }}>
      <Outlet />
    </StockContext.Provider>
  );
}

export function useStockContext() {
  return useContext<IStockContext>(StockContext);
}
