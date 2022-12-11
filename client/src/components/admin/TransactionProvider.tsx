import axios, { AxiosError } from "axios";
import {
  useCallback,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";
import { Outlet } from "react-router-dom";
import Pusher from "pusher-js";
import { useUser } from "../context/UserProvider";
import { TransactionRes } from "../../interfaces/Transaction";

const baseUrl = import.meta.env.VITE_APP_BASE_URL || "http://localhost:3000";

type ITransactionContext = {
  loading: boolean;
  transactions: TransactionRes[];
};

const TransactionContext = createContext<ITransactionContext>({
  loading: false,
  transactions: [],
});

export default function TransactionProvider() {
  const { user: admin } = useUser();
  const [transactions, setTransactions] = useState<TransactionRes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTransactions = useCallback(async () => {
    if (!admin) return;
    setLoading(true);
    try {
      const {
        data: { transactions },
      }: { data: { transactions: TransactionRes[] } } = await axios.get(
        `${baseUrl}/api/v1/transactions?sort=status,-createdAt`,
        {
          headers: {
            Authorization: `Bearer ${await admin.getIdToken()}`,
          },
        }
      );
      setTransactions(transactions);
    } catch (error) {
      const err = error as AxiosError;
      // handle error
    } finally {
      setLoading(false);
    }
  }, [admin]);

  const addTransactions = useCallback(
    (transaction: TransactionRes) => {
      if (admin && transaction.adminId !== admin.uid) return;
      setTransactions((prev) => [transaction, ...prev]);
    },
    [admin]
  );

  const updateTransactions = useCallback(
    ({ _id, fields }: { _id: string; fields: any }) => {
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction._id === _id ? { ...transaction, ...fields } : transaction
        )
      );
    },
    []
  );

  const deleteTransactions = useCallback((id: string) => {
    setTransactions((prev) => prev.filter(({ _id }) => _id !== id));
  }, []);

  useEffect(() => {
    const pusher = new Pusher(import.meta.env.VITE_APP_PUSHER_KEY, {
      cluster: import.meta.env.VITE_APP_PUSHER_CLUSTER,
    });
    const channel = pusher.subscribe("transactions");
    channel.bind("insert transaction", addTransactions);
    channel.bind("update transaction", updateTransactions);
    channel.bind("delete transaction", deleteTransactions);
    return () => {
      pusher.unsubscribe("transactions");
    };
  }, [addTransactions, updateTransactions]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <TransactionContext.Provider value={{ transactions, loading }}>
      <Outlet />
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  return useContext<ITransactionContext>(TransactionContext);
}
