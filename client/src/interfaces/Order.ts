import { FruitRes } from "./Fruit";

type OrderRes = {
  _id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  listOfFruits: {
    fruitId: FruitRes;
    quantity: number;
  }[];
};

export type { OrderRes };
