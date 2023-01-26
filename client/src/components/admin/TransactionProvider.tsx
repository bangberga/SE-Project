import { useCallback, useEffect, createContext, useContext } from "react";
import { Outlet } from "react-router-dom";
import Pusher from "pusher-js";
import { useUserContext } from "../context/UserProvider";
import { TransactionRes } from "../../interfaces/Transaction";
import useTransactions from "../../customs/hooks/useTransactions";

const baseUrl = import.meta.env.VITE_APP_BASE_URL || "http://localhost:3000";

interface ITransactionContext {
  loading: boolean;
  transactions: TransactionRes[];
}

const TransactionContext = createContext<ITransactionContext>({
  loading: false,
  transactions: [],
});
0;
export default function TransactionProvider() {
  const { user: admin } = useUserContext();
  const { transactions, loading, handleTransactions } = useTransactions(
    admin!,
    `${baseUrl}/api/v1/transactions?sort=status,-createdAt`
  );

  const addTransactions = useCallback(
    (transaction: TransactionRes) => {
      if (admin && transaction.adminId !== admin.uid) return;
      handleTransactions([...transactions, transaction]);
    },
    [admin]
  );

  const updateTransactions = useCallback(
    ({ _id, fields }: { _id: string; fields: any }) => {
      handleTransactions(
        transactions.map((transaction) =>
          transaction._id === _id ? { ...transaction, ...fields } : transaction
        )
      );
    },
    []
  );

  const deleteTransactions = useCallback((id: string) => {
    handleTransactions(transactions.filter(({ _id }) => _id !== id));
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

  return (
    <TransactionContext.Provider value={{ transactions, loading }}>
      <Outlet />
    </TransactionContext.Provider>
  );
}

export function useTransactionsContext() {
  return useContext<ITransactionContext>(TransactionContext);
}
