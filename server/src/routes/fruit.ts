import { Router } from "express";
import { getAllFruits, getFruitById, postNewFruit } from "../controllers/fruit";
import authenticationMiddleware from "../middlewares/authentication";

const router = Router();

router
  .route("/")
  .get(getAllFruits)
  .post(authenticationMiddleware, postNewFruit);
router.route("/:id").get(getFruitById);

export default router;
