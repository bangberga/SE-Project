import { Types } from "mongoose";

export default interface IOrder {
  userId: string;
  listOfFruits: {
    fruitId: typeof Types.ObjectId;
    quantity: number;
  }[];
}
