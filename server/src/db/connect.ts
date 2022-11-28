import mongoose from "mongoose";

const connectDB = (uri: string) => {
  return mongoose.connect(uri);
};

export default connectDB;

const db = mongoose.connection;
export { db };
