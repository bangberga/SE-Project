import { ErrorRequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import ResponseError from "../interfaces/error-response";

const errorHandlerMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  const customError: ResponseError = {
    err: true,
    msg: err.message || "Internal server error",
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };
  res.status(customError.statusCode).json(customError);
};

export default errorHandlerMiddleware;
