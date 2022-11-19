import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { FilterQuery } from "mongoose";
import CustomResponseError from "../errors/CustomResponseError";
import ITransaction from "../interfaces/models/ITransaction";
import Transaction from "../models/Transaction";

// customer buy something and create new transaction
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

// customer: get all transactions of him/her
// admin: get all transactions belong to admin
const getAllTransactions: RequestHandler = async (req, res) => {
  const {
    query: { status, paymentMethod },
  } = req;
  const {
    locals: { uid },
  } = res;
  const queryObj: FilterQuery<ITransaction> = {
    $or: [{ "orderId.uid": uid }, { adminId: uid }],
  };
  if (status && typeof status === "string") {
    queryObj.status = status;
  }
  if (paymentMethod && typeof paymentMethod === "string") {
    queryObj.paymentMethod = paymentMethod;
  }
  const transactions = await Transaction.find(queryObj).populate("orderId");
  if (transactions.length === 0)
    throw new CustomResponseError(
      "No transaction found",
      StatusCodes.NOT_FOUND
    );
  res.status(StatusCodes.OK).json({ transactions });
};

// only admin can update transaction
const updateTransaction: RequestHandler = async (req, res) => {
  const {
    params: { id },
    body,
  } = req;
  const {
    locals: { uid },
  } = res;
  const updatedTransaction = await Transaction.findOneAndUpdate(
    { _id: id, adminId: uid },
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

// get specific transaction of admin or buyer
const getTransactionById: RequestHandler = async (req, res) => {
  const {
    params: { id },
  } = req;
  const {
    locals: { uid },
  } = res;
  const transaction = await Transaction.findOne<ITransaction>({
    _id: id,
    $or: [{ "orderId.uid": uid }, { adminId: uid }],
  }).populate("orderId");
  if (!transaction)
    throw new CustomResponseError(
      `No transaction found with id "${id}"`,
      StatusCodes.NOT_FOUND
    );
  res.status(StatusCodes.OK).json({ transaction });
};

export {
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  postNewTransaction,
};
