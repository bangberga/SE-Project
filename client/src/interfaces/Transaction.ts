type TransactionRes = {
  _id: string;
  address: string;
  adminId: string;
  description: string;
  phone: string;
  status: "pending" | "success" | "fail";
  orderId: string;
  createdAt: string;
  updatedAt: string;
  view: boolean;
};

export type { TransactionRes };
