import { Router } from "express";
import {
  getAllTransactions,
  getTransactionById,
  postNewTransaction,
  updateTransaction,
} from "../controllers/transaction";
import { postNewOrder } from "../controllers/order";
import verifyTokenMiddleware from "../middlewares/verify-token";
import determineCustomClaims from "../middlewares/determine-custom-claims";

const router = Router();

router.use(verifyTokenMiddleware);
router
  .route("/")
  .get(getAllTransactions)
  .post(determineCustomClaims, postNewOrder, postNewTransaction);
router.route("/:id").get(getTransactionById).patch(updateTransaction);

export default router;
