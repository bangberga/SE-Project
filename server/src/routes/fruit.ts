import { Router } from "express";
import { getAllFruits, getFruitById } from "../controllers/fruit";

const router = Router();

router.route("/").get(getAllFruits);
router.route("/:id").get(getFruitById);

export default router;
