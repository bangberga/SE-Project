import { useCallback, useEffect, useState } from "react";
import { TransactionRes } from "../../interfaces/Transaction";
import axios, { AxiosError } from "axios";
import { User } from "firebase/auth";

export default function useTransactions(admin: User, url: string) {
  const [transactions, setTransactions] = useState<TransactionRes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { transactions },
      }: { data: { transactions: TransactionRes[] } } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${await admin.getIdToken()}`,
        },
      });
      setTransactions(transactions);
    } catch (error) {
      const err = error as AxiosError;
      // handle error
    } finally {
      setLoading(false);
    }
  }, [admin, url]);

  const handleTransactions = useCallback((transactions: TransactionRes[]) => {
    setTransactions(transactions);
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { transactions, loading, handleTransactions };
}
