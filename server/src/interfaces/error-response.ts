import { StatusCodes } from "http-status-codes";

interface ResponseError {
  err?: true;
  msg: string;
  statusCode: StatusCodes;
}

export default ResponseError;
