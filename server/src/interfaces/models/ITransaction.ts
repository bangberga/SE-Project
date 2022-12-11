import { Types } from "mongoose";

export default interface ITransaction {
  adminId: string;
  address: string;
  phone: string;
  description: string;
  orderId: typeof Types.ObjectId;
  status: "pending" | "success" | "fail";
  paymentMethod: "in cash" | "paypal";
  view: boolean;
}
