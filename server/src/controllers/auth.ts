import { RequestHandler } from "express";
import { getAuth } from "firebase-admin/auth";
import { StatusCodes } from "http-status-codes";
import CustomResponseError from "../errors/CustomResponseError";

const register: RequestHandler = async (req, res) => {
  const {
    query: { role },
  } = req;
  const {
    locals: { uid },
  } = res;
  const user = await getAuth().getUser(uid);
  if (typeof user.customClaims?.admin === "boolean")
    throw new CustomResponseError(
      "Account has already registered!",
      StatusCodes.BAD_REQUEST
    );
  if (typeof role === "string" && role === "admin")
    await getAuth().setCustomUserClaims(uid, { admin: true });
  else await getAuth().setCustomUserClaims(uid, { admin: false });

  res.status(StatusCodes.CREATED).json({ user });
};

const getRole: RequestHandler = (req, res) => {
  const {
    locals: { customClaims },
  } = res;
  res.status(StatusCodes.OK).json({ admin: customClaims.admin });
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
