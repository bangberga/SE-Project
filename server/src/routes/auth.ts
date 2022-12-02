import { Router } from "express";
import { getRole, getUser, register } from "../controllers/auth";
import determineCustomClaims from "../middlewares/determine-custom-claims";
import verifyTokenMiddleware from "../middlewares/verify-token";
import rateLimiterMiddleware from "../middlewares/rate-limiter";

const router = Router();

router
  .route("/register")
  .post(rateLimiterMiddleware(15, 3), verifyTokenMiddleware, register);
router
  .route("/role")
  .get(verifyTokenMiddleware, determineCustomClaims, getRole);
router.route("/getUser").get(getUser);

export default router;
