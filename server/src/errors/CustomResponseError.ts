import { StatusCodes } from "http-status-codes";

class CustomResponseError extends Error {
  public readonly err: boolean;
  public readonly statusCode: StatusCodes;
  constructor(message: string, statusCode: StatusCodes) {
    super(message);
    this.statusCode = statusCode;
    this.err = true;
  }
}

export default CustomResponseError;
