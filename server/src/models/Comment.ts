import { Schema, model, SchemaDefinition, Types } from "mongoose";
import IComment from "../interfaces/IComment";

const schemaDefinition: SchemaDefinition<IComment> = {
  productId: {
    type: Types.ObjectId,
    ref: "Fruit",
    required: [true, "Please provide fruit's id"],
  },
  userId: {
    type: String,
    ref: "User",
    required: [true, "Please provide user's id"],
  },
  comment: {
    type: String,
    required: [true, "Please provide comment"],
    maxlength: [255, "Comment must be <= 255 characters"],
  },
  parent: {
    type: Types.ObjectId,
    ref: "Comment",
    required: [true, "Please provide parent's id"],
  },
};

const CommentSchema = new Schema<IComment>(schemaDefinition, {
  timestamps: true,
});

export default model("Comment", CommentSchema);
