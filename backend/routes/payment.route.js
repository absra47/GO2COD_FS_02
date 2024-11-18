import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createCheckoutSession } from "../controllers/payment.conroller.js";

const router = express.Router();
router.post("/create-checkout-session", protectRoute, createCheckoutSession);

export default router;
