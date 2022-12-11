import { Schema, model, SchemaDefinition, Types, Model } from "mongoose";
import IOrder from "../interfaces/models/IOrder";
import { getAuth, UserRecord } from "firebase-admin/auth";
import Fruit from "./Fruit";
import IFruit from "../interfaces/models/IFruit";
import CustomResponseError from "../errors/CustomResponseError";
import { StatusCodes } from "http-status-codes";

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
      validator: function (v: any[]) {
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

OrderSchema.pre("save", async function () {
  const filtered = this.listOfFruits.map((item) => {
    const { fruitId, quantity: purchaseQuanity } = item;
    return Fruit.findOne<IFruit>({
      _id: fruitId,
      quantity: { $lt: purchaseQuanity },
    });
  });
  if ((await Promise.all(filtered)).filter((item) => item !== null).length)
    throw new CustomResponseError(
      "Some fruit you buy are not enough quantity!",
      StatusCodes.BAD_REQUEST
    );
});

OrderSchema.methods.getBuyer = function () {
  return getAuth().getUser(this.userId);
};

export default model("Order", OrderSchema);
