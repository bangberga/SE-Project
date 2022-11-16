import { Schema, SchemaDefinition, model } from "mongoose";
import IUser from "../interfaces/IUser";

const schemaDefinition: SchemaDefinition<IUser> = {
  id: {
    type: String,
    required: [true, "Please provide user's id"],
    unique: true,
  },
  role: {
    type: String,
    enum: {
      values: ["admin", "customer"],
      message: "Oops! {VALUE} is not supported",
    },
    default: "customer",
  },
};

const UserSchema = new Schema<IUser>(schemaDefinition, {
  timestamps: true,
  _id: false,
});

export default model("User", UserSchema);
