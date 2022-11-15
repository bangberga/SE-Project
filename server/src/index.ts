import * as dotenv from "dotenv";
dotenv.config();
require("express-async-errors");
import cors from "cors";
import express from "express";
import connectDB from "./db/connect";

// middlewares
import notFoundMiddleware from "./middlewares/not-found";
import errorHandlerMiddleware from "./middlewares/error-handler";
import CustomResponseError from "./errors/CustomResponseError";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("Hello from server"));

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 3000;

(async function () {
  try {
    const uri = process.env.MONGO_URI;
    if (uri) {
      await connectDB(uri);
      app.listen(PORT, () =>
        console.log(`Server is listening on PORT ${PORT}...`)
      );
    } else throw Error("URI is not found");
  } catch (error) {
    console.error(error);
  }
})();
