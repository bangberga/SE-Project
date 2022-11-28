type FruitReq = {
  name: string;
  price: number;
  quantity: number;
  description?: string;
  image?: string[];
};

type FruitRes = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
  image: string[];
  description: string;
  owner: string;
};
export type { FruitReq, FruitRes };
