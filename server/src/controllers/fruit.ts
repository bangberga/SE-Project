import { RequestHandler } from "express";
import { FilterQuery } from "mongoose";
import { StatusCodes } from "http-status-codes";
import Fruit from "../models/Fruit";
import IFruit from "../interfaces/models/IFruit";
import CustomResponseError from "../errors/CustomResponseError";
import { UserRecord } from "firebase-admin/auth";

const getAllFruits: RequestHandler = async (req, res) => {
  const {
    query: { name, owner, filters, sort, limit, fields, skip, detail },
  } = req;
  const queryObj: FilterQuery<IFruit> = {};
  if (name && typeof name === "string")
    queryObj.name = { $regex: name, $options: "i" };
  if (owner && typeof owner === "string") queryObj.owner = owner;
  if (filters && typeof filters === "string") {
    const operatorsMap = new Map<string, string>();
    operatorsMap.set(">", "$gt");
    operatorsMap.set(">=", "$gte");
    operatorsMap.set("=", "$eq");
    operatorsMap.set("<", "$lt");
    operatorsMap.set("<=", "$lte");
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let newFilters = filters.replace(
      regEx,
      (match) => `-${operatorsMap.get(match)}-`
    );
    const options = ["price", "rating"];
    newFilters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      const numValaue = Number(value);
      if (options.includes(field) && !isNaN(numValaue))
        queryObj[field] = { [operator]: numValaue };
    });
  }
  const result = Fruit.find(queryObj);
  if (sort && typeof sort === "string") {
    let sortList = sort.split(",").join(" ");
    result.sort(sortList);
  }
  const numLimit = Number(limit);
  if (!isNaN(numLimit)) result.limit(numLimit);
  if (fields && typeof fields === "string") {
    let fieldsList = fields.split(",").join(" ");
    result.select(fieldsList);
  }
  const numSkip = Number(skip);
  if (!isNaN(numSkip)) result.skip(numSkip);
  const fruits = await result;
  let ownerDetail: UserRecord[];
  if (detail && typeof detail === "string" && detail === "true") {
    ownerDetail = await Promise.all(fruits.map((fruit) => fruit.getOwner()));
    return res.status(StatusCodes.OK).json({ fruits, ownerDetail });
  }
  if (fruits.length === 0)
    throw new CustomResponseError("No fruits found", StatusCodes.NOT_FOUND);
  res.status(StatusCodes.OK).json({ fruits });
};

const getFruitById: RequestHandler = async (req, res) => {
  const {
    params: { id },
  } = req;
  const fruit = await Fruit.findById(id);
  if (!fruit)
    throw new CustomResponseError(
      `No fruit with id: ${id}`,
      StatusCodes.NOT_FOUND
    );
  res.status(StatusCodes.OK).json({ fruit, owner: await fruit.getOwner() });
};

const postNewFruit: RequestHandler = async (req, res) => {
  const { body } = req;
  const {
    locals: { uid, customClaims },
  } = res;
  if (!customClaims.admin)
    throw new CustomResponseError(
      "Not allowed",
      StatusCodes.METHOD_NOT_ALLOWED
    );
  const fruit = await Fruit.create<IFruit>({ ...body, owner: uid });
  res.status(StatusCodes.CREATED).json({ fruit });
};

const updateFruit: RequestHandler = async (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  const {
    locals: { uid },
  } = res;
  const updated = await Fruit.findOneAndUpdate<IFruit>(
    { _id: id, owner: uid },
    body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updated)
    throw new CustomResponseError(
      "Not found fruit to update",
      StatusCodes.NOT_FOUND
    );
  res.status(StatusCodes.OK).json({ updated });
};

const deleteFruitById: RequestHandler = async (req, res) => {
  const {
    params: { id },
  } = req;
  const {
    locals: { uid },
  } = res;
  const deletedFruit = await Fruit.findOneAndDelete<IFruit>({
    _id: id,
    owner: uid,
  });
  if (!deleteFruitById)
    throw new CustomResponseError("No fruit to delete", StatusCodes.NOT_FOUND);
  res.status(StatusCodes.OK).json({ deletedFruit });
};

export {
  getAllFruits,
  getFruitById,
  postNewFruit,
  updateFruit,
  deleteFruitById,
};
