import { RequestHandler } from "express";
import { getAuth } from "firebase-admin/auth";
import { StatusCodes } from "http-status-codes";
import CustomResponseError from "../errors/CustomResponseError";

const authenticationMiddleware: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer "))
    throw new CustomResponseError(
      "Invalid Authentication",
      StatusCodes.UNAUTHORIZED
    );
  const token = authHeader.split(" ")[1];
  
  // verify user id
  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    res.locals.uid = decodedToken.uid;
    next();
  } catch (error) {
    throw new CustomResponseError(
      "Invalid Authentication or Expired Token",
      StatusCodes.UNAUTHORIZED
    );
  }
};

export default authenticationMiddleware;
