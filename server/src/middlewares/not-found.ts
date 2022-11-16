import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import ResponseError from "../interfaces/IResponseError";

const notFoundMiddleware: RequestHandler = (req, res) => {
  const customError: ResponseError = {
    msg: "Route does not exist",
    statusCode: StatusCodes.NOT_FOUND,
  };
  return res.status(StatusCodes.NOT_FOUND).json(customError);
};

export default notFoundMiddleware;
