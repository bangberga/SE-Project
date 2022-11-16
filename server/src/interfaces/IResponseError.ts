import { StatusCodes } from "http-status-codes";

interface IResponseError {
  err?: true;
  msg: string;
  statusCode: StatusCodes;
}

export default IResponseError;
