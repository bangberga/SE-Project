import { Router } from "express";
import {
  getAllFruits,
  getFruitById,
  postNewFruit,
  updateFruit,
  deleteFruitById,
} from "../controllers/fruit";
import verifyTokenMiddleware from "../middlewares/verify-token";
import determineCustomClaims from "../middlewares/determine-custom-claims";

const router = Router();

router
  .route("/")
  .get(getAllFruits)
  .post(verifyTokenMiddleware, determineCustomClaims, postNewFruit);
router
  .route("/:id")
  .get(getFruitById)
  .patch(verifyTokenMiddleware, updateFruit)
  .delete(verifyTokenMiddleware, deleteFruitById);

export default router;
