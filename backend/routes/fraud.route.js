import { Router } from "express";
import { checkFraud } from "../controllers/fraud.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.post('/check', protect, checkFraud)

export default router;