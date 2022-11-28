import { ErrorRequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import ResponseError from "../interfaces/IResponseError";

const errorHandlerMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  const customError: ResponseError = {
    err: true,
    msg: err.message || "Internal server error",
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };
  if (err.name === "ValidationError") {
    customError.statusCode = StatusCodes.BAD_REQUEST;
    const errors = Object.values(err.errors) as { message: string }[];
    customError.msg = errors.map((item) => item.message).join(", ");
  }
  if (err.name === "CastError") {
    customError.statusCode = StatusCodes.NOT_FOUND;
    customError.msg = `No item found with id "${err.value}"`;
  }

  // return res.status(500).json({ err });
  return res.status(customError.statusCode).json(customError);
};

export default errorHandlerMiddleware;
