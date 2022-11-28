import { Router } from "express";
import { getRole, getUser, register } from "../controllers/auth";
import determineCustomClaims from "../middlewares/determine-custom-claims";
import verifyTokenMiddleware from "../middlewares/verify-token";

const router = Router();

router.route("/register").post(verifyTokenMiddleware, register);
router
  .route("/role")
  .get(verifyTokenMiddleware, determineCustomClaims, getRole);
router.route("/getUser").get(getUser);

export default router;
