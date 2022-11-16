import { Schema, model, ValidatorProps, SchemaDefinition } from "mongoose";

const def: SchemaDefinition = {
  name: {
    type: String,
    required: [true, "Please provide fruit name"],
    maxLength: [20, "Fruit name length must <= 20"],
    unique: true,
    trim: true,
  },
  price: {
    type: Number,
    validate: {
      validator: function (v: number) {
        return v >= 0;
      },
      message: (props: ValidatorProps) => `${props.value} is a negative number`,
    },
    required: [true, "Please provide fruit price"],
  },
  quantity: {
    type: Number,
    validate: {
      validator: function (v: number) {
        return v >= 0;
      },
      message: (props: ValidatorProps) => `${props.value} is a negative number`,
    },
    default: 0,
  },
  image: {
    type: [String],
    default:
      "https://firebasestorage.googleapis.com/v0/b/fruit-selling-management.appspot.com/o/unavailable%20image.jpg?alt=media&token=f26215c3-2fb8-42d9-ba4c-937f46aeea1",
  },
};

const FruitSchema = new Schema(def, { timestamps: true });

export default model("Fruit", FruitSchema);
