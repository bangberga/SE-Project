import { Schema, model, SchemaDefinition, Types } from "mongoose";

const schemaDefinition: SchemaDefinition = {
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
  },
};

const OrderSchema = new Schema(schemaDefinition, { timestamps: true });

export default model("Order", OrderSchema);
