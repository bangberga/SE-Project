import * as dotenv from "dotenv";
dotenv.config();
require("express-async-errors");
import { initializeApp, cert } from "firebase-admin/app";
import cors from "cors";
import helmet from "helmet";
import express from "express";
import { ServiceAccount } from "firebase-admin";
import Pusher from "pusher";

import connectDB from "./db/connect";

import authRouter from "./routes/auth";
import fruitRouter from "./routes/fruit";
import orderRouter from "./routes/order";
import transactionRouter from "./routes/transaction";

import notFoundMiddleware from "./middlewares/not-found";
import errorHandlerMiddleware from "./middlewares/error-handler";
import {
  fruitsChangeStream,
  ordersChangeStream,
  transactionsChangeStream,
} from "./db/pusher";
import Order from "./models/Order";
import Transaction from "./models/Transaction";
import Fruit from "./models/Fruit";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID as string,
  key: process.env.PUSHER_KEY as string,
  secret: process.env.PUSHER_SECRET as string,
  cluster: process.env.PUSHER_CLUSTER as string,
  useTLS: true,
});

const app = express();

app.set("trust proxy", 1);

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(require("xss-clean")());
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    process.env.CLIENT_URL || "http://127.0.0.1:5173"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );
  next();
});

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/fruits", fruitRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/transactions", transactionRouter);

// Middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 3000;

(async function () {
  try {
    const uri = process.env.MONGO_URI;
    if (uri) {
      await connectDB(uri);
      initializeApp({
        credential: cert(require("../service-account.json") as ServiceAccount),
      });
      app.listen(PORT, () =>
        console.log(`Server is listening on PORT ${PORT}...`)
      );
      fruitsChangeStream(pusher);
      ordersChangeStream(pusher);
      transactionsChangeStream(pusher);
    } else throw Error("URI is not found");
  } catch (error) {
    console.error(error);
  }
})();
