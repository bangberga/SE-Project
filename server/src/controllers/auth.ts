import { RequestHandler } from "express";
import { getAuth } from "firebase-admin/auth";
import { StatusCodes } from "http-status-codes";
import instanceOfEnum from "../utils/instanceOfEnum";
import CustomResponseError from "../errors/CustomResponseError";
import { Role } from "../interfaces/models/IUser";

const register: RequestHandler = async (req, res) => {
  const {
    query: { role },
  } = req;
  const {
    locals: { uid },
  } = res;
  const user = await getAuth().getUser(uid);
  if (user.customClaims && user.customClaims.role)
    throw new CustomResponseError(
      "Account has already registered!",
      StatusCodes.BAD_REQUEST
    );
  if (typeof role === "string" && instanceOfEnum(Role, role))
    await getAuth().setCustomUserClaims(uid, { role });
  else
    throw new CustomResponseError(
      "Missing or invalid role",
      StatusCodes.BAD_REQUEST
    );
  res.status(StatusCodes.CREATED).json({ user });
};

const getRole: RequestHandler = (req, res) => {
  const {
    locals: { customClaims },
  } = res;
  res.status(StatusCodes.OK).json({ role: customClaims.role });
};

const getUser: RequestHandler = async (req, res) => {
  const {
    query: { uid },
  } = req;
  if (uid && typeof uid === "string") {
    try {
      const { email, photoURL, displayName } = await getAuth().getUser(uid);
      res
        .status(StatusCodes.OK)
        .json({ user: { uid, email, photoURL, displayName } });
    } catch (error) {
      throw new CustomResponseError("Not found user", StatusCodes.NOT_FOUND);
    }
  } else throw new CustomResponseError("Not found user", StatusCodes.NOT_FOUND);
};

export { register, getRole, getUser };
