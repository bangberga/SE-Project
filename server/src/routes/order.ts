import { Router } from "express";
import { getOrderById } from "../controllers/order";

const router = Router();

router.route("/:id").get(getOrderById);

export default router;
