import * as dotenv from "dotenv";
dotenv.config();
require("express-async-errors");
import { initializeApp, cert } from "firebase-admin/app";
import cors from "cors";
import helmet from "helmet";
import rateLimiter from "express-rate-limit";
import express from "express";
import Pusher from "pusher";
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID as string,
  key: process.env.PUSHER_KEY as string,
  secret: process.env.PUSHER_SECRET as string,
  cluster: process.env.PUSHER_CLUSTER as string,
  useTLS: true,
});

import connectDB from "./db/connect";

import authRouter from "./routes/auth";
import fruitRouter from "./routes/fruit";
import transactionRouter from "./routes/transaction";

import notFoundMiddleware from "./middlewares/not-found";
import errorHandlerMiddleware from "./middlewares/error-handler";
import { ServiceAccount } from "firebase-admin";
import { fruitsChangeStream } from "./db/pusher";

const app = express();

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
);

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(require("xss-clean")());

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/fruits", fruitRouter);
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
    } else throw Error("URI is not found");
  } catch (error) {
    console.error(error);
  }
})();
