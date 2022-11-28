import { RequestHandler } from "express";
import Order from "../models/Order";
import CustomResponseError from "../errors/CustomResponseError";
import { StatusCodes } from "http-status-codes";

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

export { postNewOrder };
