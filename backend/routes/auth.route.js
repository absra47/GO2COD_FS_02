import express from "express";
import {
  login,
  logout,
  signup,
  refeshToken,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refeshToken);
// router.post("/profile", getProfile);

export default router;
