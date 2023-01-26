import axios from "axios";
import { useEffect, useState } from "react";
import { UserRes } from "../../interfaces/User";

export default function useUser(url: string) {
  const [user, setUser] = useState<UserRes | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get(url)
      .then((response) => {
        const {
          data: { user },
        }: { data: { user: UserRes } } = response;
        setUser(user);
      })
      .catch((error) => {
        // handle error
      })
      .finally(() => setLoading(false));
  }, [url]);

  return { user, loading };
}
