import { RequestHandler } from "express";
import { getAuth } from "firebase-admin/auth";
import { StatusCodes } from "http-status-codes";
import CustomResponseError from "../errors/CustomResponseError";

const determineCustomClaims: RequestHandler = async (req, res, next) => {
  const {
    locals: { uid },
  } = res;

  const { customClaims } = await getAuth().getUser(uid);
  if (!customClaims)
    throw new CustomResponseError(
      "Must register befrore getting claims",
      StatusCodes.FAILED_DEPENDENCY
    );
  res.locals.customClaims = customClaims;
  next();
};

export default determineCustomClaims;
