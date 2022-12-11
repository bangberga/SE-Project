import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { FilterQuery } from "mongoose";
import CustomResponseError from "../errors/CustomResponseError";
import ITransaction from "../interfaces/models/ITransaction";
import Fruit from "../models/Fruit";
import Order from "../models/Order";
import Transaction from "../models/Transaction";

// customer buy something and create new transaction
const postNewTransaction: RequestHandler = async (req, res) => {
  const { body } = req;
  const {
    locals: { order },
  } = res;
  try {
    const transaction = await Transaction.create<ITransaction>({
      ...body,
      orderId: order._id,
    });
    const listOfFruits: { fruitId: string; quantity: number }[] =
      order.listOfFruits;
    await Promise.all(
      listOfFruits.map(({ fruitId, quantity }) =>
        Fruit.findOneAndUpdate(
          { _id: fruitId },
          {
            $inc: {
              quantity: -quantity,
            },
          }
        )
      )
    );
    res.status(StatusCodes.CREATED).json({ transaction });
  } catch (error) {
    await Order.findByIdAndDelete(order._id);
    throw error;
  }
};

// customer: get all transactions of him/her
// admin: get all transactions belong to admin
const getAllTransactions: RequestHandler = async (req, res) => {
  const {
    query: { status, paymentMethod, sort },
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
  const result = Transaction.find<ITransaction>(queryObj);
  if (sort && typeof sort === "string") {
    let sortList = sort.split(",").join(" ");
    result.sort(sortList);
  }
  const transactions = await result;
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
  const updatedTransaction = await Transaction.findOneAndUpdate<ITransaction>(
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

const deleteTransaction: RequestHandler = async (req, res) => {
  const {
    params: { id },
  } = req;
  const {
    locals: { uid },
  } = res;
  const deletedTransaction = await Transaction.findOneAndDelete<ITransaction>({
    _id: id,
    adminId: uid,
  });
  if (!deletedTransaction)
    throw new CustomResponseError(
      `No transaction with id ${id} to delete`,
      StatusCodes.NOT_FOUND
    );
  res.status(StatusCodes.OK).json({ deletedTransaction });
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
  deleteTransaction,
};
