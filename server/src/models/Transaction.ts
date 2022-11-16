import { Schema, model, SchemaDefinition, Types } from "mongoose";
import validatePhoneNumber from "../utils/validatePhoneNumber";

const schemaDefinition: SchemaDefinition = {
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
  },
  orderId: {
    type: Types.ObjectId,
    ref: "Order",
  },
};

const TransactionSchema = new Schema(schemaDefinition, { timestamps: true });

export default model("Transaction", TransactionSchema);
