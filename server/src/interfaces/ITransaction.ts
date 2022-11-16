import { Types } from "mongoose";

export default interface ITransaction {
  address: string;
  phone: string;
  description: string;
  orderId: typeof Types.ObjectId;
  status: "pending" | "success" | "fail";
  paymentMethod: "in cash" | "paypal";
}
