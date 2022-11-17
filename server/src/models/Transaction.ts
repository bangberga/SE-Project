import { Schema, model, SchemaDefinition, Types } from "mongoose";
import validatePhoneNumber from "../utils/validatePhoneNumber";
import ITransaction from "../interfaces/models/ITransaction";

const schemaDefinition: SchemaDefinition<ITransaction> = {
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
};

const TransactionSchema = new Schema<ITransaction>(schemaDefinition, {
  timestamps: true,
});

export default model("Transaction", TransactionSchema);
