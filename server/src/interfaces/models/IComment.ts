import { Types } from "mongoose";

export default interface IComment {
  productId: typeof Types.ObjectId;
  userId: string;
  comment: string;
  parent: typeof Types.ObjectId;
}
