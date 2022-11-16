import IFruit from "./IFruit";

export default interface IOrder {
  userId: string;
  listOfFruits: IFruit[];
}
