import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { FruitRes } from "../../interfaces/Fruit";

export default function useFruits(url: string) {
  const [fruits, setFruits] = useState<FruitRes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchFruits = useCallback(
    async (controller: AbortController) => {
      setLoading(true);
      try {
        const {
          data: { fruits },
        }: { data: { fruits: FruitRes[] } } = await axios.get(url, {
          signal: controller.signal,
        });
        setFruits(fruits);
      } catch (error) {
        const err = error as AxiosError;
        if (err.status === 404) {
          // handle error not found
        }
      } finally {
        setLoading(false);
      }
    },
    [url]
  );

  const handleFruits = useCallback((fruits: FruitRes[]) => {
    setFruits(fruits);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchFruits(controller);
    return () => {
      controller.abort();
    };
  }, [fetchFruits]);

  return { fruits, loading, handleFruits };
}
