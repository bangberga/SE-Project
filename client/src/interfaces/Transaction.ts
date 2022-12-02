type TransactionRes = {
  _id: string;
  address: string;
  description: string;
  phone: string;
  status: "pending" | "success" | "fail";
  orderId: string;
  createdAt: string;
  updatedAt: string;
};

export type { TransactionRes };
