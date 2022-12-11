import { Schema, model, SchemaDefinition, Types } from "mongoose";
import validatePhoneNumber from "../utils/validatePhoneNumber";
import ITransaction from "../interfaces/models/ITransaction";
import Order from "./Order";
import IOrder from "../interfaces/models/IOrder";

const schemaDefinition: SchemaDefinition<ITransaction> = {
  adminId: {
    type: String,
    required: [true, "Please provide an admin's id"],
  },
  address: {
    type: String,
    required: [true, "Please provide an address"],
    maxlength: [155, "Address must be <= 155 characters"],
    trim: true,
  },
  phone: {
    type: String,
    required: [true, "Please provide a phone number"],
    validate: {
      validator: async (v: string) => {
        return await validatePhoneNumber(v, "VN");
      },
      message: (props) => `${props.value} is an invalid phone number`,
    },
  },
  description: {
    type: String,
    maxlength: [255, "Description must be <= 255 characters"],
    trim: true,
    default: "No description",
  },
  orderId: {
    type: Types.ObjectId,
    ref: "Order",
    required: [true, "Please provide order's id"],
  },
  status: {
    type: String,
    enum: {
      values: ["pending", "success", "fail"],
      message: "Oops! {VALUE} is not supported",
    },
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: {
      values: ["in cash", "paypal"],
      message: "Oops! {VALUE} is not supported",
    },
    default: "in cash",
  },
  view: {
    type: Boolean,
    default: false,
  },
};

const TransactionSchema = new Schema<ITransaction>(schemaDefinition, {
  timestamps: true,
});

// delete the order that belong to the transaction
TransactionSchema.post("findOneAndDelete", async function (res, next) {
  await Order.findOneAndDelete<IOrder>({ _id: res.orderId });
});

export default model("Transaction", TransactionSchema);
