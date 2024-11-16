import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getCoupon, validteCoupon } from "../controllers/coupon.controller.js";
const router = express.Router();
router.get("/", protectRoute, getCoupon);
router.get("/validate", protectRoute, validteCoupon);
export default router;
