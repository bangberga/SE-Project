import { Router } from "express";
import {
  getAllTransactions,
  getTransactionById,
  postNewTransaction,
  updateTransaction,
} from "../controllers/transaction";
import { postNewOrder } from "../controllers/order";
import authenticationMiddleware from "../middlewares/authentication";

const router = Router();

router.use(authenticationMiddleware);
router
  .route("/")
  .get(getAllTransactions)
  .post(postNewOrder, postNewTransaction);
router.route("/:id").get(getTransactionById).patch(updateTransaction);

export default router;
