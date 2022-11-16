import { RequestHandler } from "express";
import { FilterQuery } from "mongoose";
import { StatusCodes } from "http-status-codes";
import Fruit from "../models/Fruit";
import IFruit from "../interfaces/models/IFruit";
import CustomResponseError from "../errors/CustomResponseError";

const getAllFruits: RequestHandler = async (req, res) => {
  const {
    query: { name, owner, filters, sort, limit, fields, skip },
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
  // TODO: get infor of owner
  res.status(StatusCodes.OK).json({ fruit });
};

const postNewFruit: RequestHandler = async (req, res) => {
  const { body } = req;
};

export { getAllFruits, getFruitById };
