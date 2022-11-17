import { RequestHandler } from "express";
import Order from "../models/Order";
import IOrder from "../interfaces/models/IOrder";

const postNewOrder: RequestHandler = async (req, res, next) => {
  const {
    locals: { uid },
  } = res;
  const { body } = req;
  const order = await Order.create<IOrder>({ ...body, userId: uid });
  res.locals.orderId = order[0]._id;
  next();
};

export { postNewOrder };
