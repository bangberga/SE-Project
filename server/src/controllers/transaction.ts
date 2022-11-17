import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { FilterQuery } from "mongoose";
import CustomResponseError from "../errors/CustomResponseError";
import ITransaction from "../interfaces/models/ITransaction";
import Transaction from "../models/Transaction";

const postNewTransaction: RequestHandler = async (req, res) => {
  const { body } = req;
  const {
    locals: { orderId },
  } = res;
  const transaction = await Transaction.create<ITransaction>({
    ...body,
    orderId,
  });
  res.status(StatusCodes.CREATED).json({ transaction });
};

const getAllTransactions: RequestHandler = async (req, res) => {
  const {
    query: { status, paymentMethod },
  } = req;
  const {
    locals: { uid },
  } = res;
  const queryObj: FilterQuery<ITransaction> = { "orderId.uid": uid };
  if (status && typeof status === "string") {
    queryObj.status = status;
  }
  if (paymentMethod && typeof paymentMethod === "string") {
    queryObj.paymentMethod = paymentMethod;
  }
  const transaction = await Transaction.find(queryObj).populate("orderId");
  if (transaction.length === 0)
    throw new CustomResponseError(
      "No transaction found",
      StatusCodes.NOT_FOUND
    );
  res.status(StatusCodes.OK).json({ transaction });
};

const updateTransaction: RequestHandler = async (req, res) => {
  const {
    params: { id },
    body,
  } = req;
  const {
    locals: { uid },
  } = res;
  const updatedTransaction = await Transaction.findOneAndUpdate(
    { _id: id, "orderId.uid": uid },
    body,
    { runValidators: true, new: true }
  ).populate("orderId");
  if (!updatedTransaction)
    throw new CustomResponseError(
      `No transaction found with id "${id}"`,
      StatusCodes.NOT_FOUND
    );
  res.status(StatusCodes.OK).json({ updatedTransaction });
};

const getTransactionById: RequestHandler = async (req, res) => {
  const {
    params: { id },
  } = req;
  const {
    locals: { uid },
  } = res;
  const transaction = await Transaction.findOne<ITransaction>({
    _id: id,
    "orderId.uid": uid,
  }).populate("orderId");
  res.status(StatusCodes.OK).json({ transaction });
};

export {
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  postNewTransaction,
};
