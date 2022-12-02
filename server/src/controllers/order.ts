import { RequestHandler } from "express";
import Order from "../models/Order";
import CustomResponseError from "../errors/CustomResponseError";
import { StatusCodes } from "http-status-codes";
import { PopulateOptions } from "mongoose";

const postNewOrder: RequestHandler = async (req, res, next) => {
  const {
    locals: { uid, customClaims },
  } = res;
  const { body } = req;
  if (customClaims.admin)
    throw new CustomResponseError(
      "Not allowed because you are an admin",
      StatusCodes.METHOD_NOT_ALLOWED
    );
  const order = await Order.create({ ...body, userId: uid });
  res.locals.order = order;
  next();
};

const getOrderById: RequestHandler = async (req, res) => {
  const {
    params: { id },
  } = req;
  const order = await Order.findById(id).populate({
    path: "listOfFruits.fruitId",
  } as PopulateOptions);
  if (!order)
    throw new CustomResponseError(
      `No order found with id ${id}`,
      StatusCodes.NOT_FOUND
    );
  res.status(StatusCodes.OK).json({ order, buyer: await order.getBuyer() });
};

export { postNewOrder, getOrderById };
