import { Schema, model, ValidatorProps, SchemaDefinition } from "mongoose";

const schemaDefinition: SchemaDefinition = {
  name: {
    type: String,
    required: [true, "Please provide fruit name"],
    maxlength: [20, "Fruit name length must be <= 20"],
    unique: true,
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
    default:
      "https://firebasestorage.googleapis.com/v0/b/fruit-selling-management.appspot.com/o/unavailable%20image.jpg?alt=media&token=f26215c3-2fb8-42d9-ba4c-937f46aeea1",
  },
  description: {
    type: String,
    maxlength: [255, "Description length must be <= 255 characters"],
  },
};

const FruitSchema = new Schema(schemaDefinition, { timestamps: true });

export default model("Fruit", FruitSchema);
