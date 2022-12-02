import { Schema, model, SchemaDefinition, Types, Model } from "mongoose";
import IOrder from "../interfaces/models/IOrder";
import IFruit from "../interfaces/models/IFruit";
import { getAuth, UserRecord } from "firebase-admin/auth";

interface OrderMethods {
  getBuyer(): Promise<UserRecord>;
}

type OrderModel = Model<IOrder, {}, OrderMethods>;

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

const OrderSchema = new Schema<IOrder, OrderModel, OrderMethods>(
  schemaDefinition,
  { timestamps: true }
);

OrderSchema.methods.getBuyer = function () {
  return getAuth().getUser(this.userId);
};

export default model("Order", OrderSchema);
