import { Schema, model, SchemaDefinition, Model } from "mongoose";
import { getAuth, UserRecord } from "firebase-admin/auth";
import IFruit from "../interfaces/models/IFruit";

interface FruitMethods {
  getOwner(): Promise<UserRecord>;
}

type FruitModel = Model<IFruit, {}, FruitMethods>;

const schemaDefinition: SchemaDefinition<IFruit> = {
  name: {
    type: String,
    required: [true, "Please provide fruit name"],
    maxlength: [20, "Fruit name length must be <= 20"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Please provide fruit price"],
    min: [0, "Please provide a positive price"],
  },
  quantity: {
    type: Number,
    default: 0,
    min: [0, "Please provide a positive quantity"],
  },
  image: {
    type: [String],
    default: "/unavailable image.jpg",
  },
  description: {
    type: String,
    maxlength: [255, "Description length must be <= 255 characters"],
    trim: true,
    default: "No description",
  },
  owner: {
    type: String,
    required: [true, "Please provide an owner"],
  },
  rating: {
    type: Number,
    min: [0, "Minimum must be 0"],
    max: [5, "Maximum must be 5"],
    default: 0,
  },
};

const FruitSchema = new Schema<IFruit, FruitModel, FruitMethods>(
  schemaDefinition,
  { timestamps: true }
);

FruitSchema.methods.getOwner = function () {
  return getAuth().getUser(this.owner);
};

export default model<IFruit, FruitModel>("Fruit", FruitSchema);
