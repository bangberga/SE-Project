import { Schema, model, SchemaDefinition, Types } from "mongoose";
import IOrder from "../interfaces/models/IOrder";
import IFruit from "../interfaces/models/IFruit";

const schemaDefinition: SchemaDefinition<IOrder> = {
  userId: {
    type: String,
    required: [true, "Please provide customer's id"],
  },
  listOfFruits: {
    type: [
      {
        fruitId: {
          type: Types.ObjectId,
          ref: "Fruit",
        },
        quantity: {
          type: Number,
          min: 1,
          default: 1,
        },
      },
    ],
    validate: {
      validator: function (v: IFruit[]) {
        return v.length > 0;
      },
      message: "At least 1 type of fruit",
    },
  },
};

const OrderSchema = new Schema<IOrder>(schemaDefinition, { timestamps: true });

export default model("Order", OrderSchema);
