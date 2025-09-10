import { Router } from "express";

import { applyForLoan, getLoans, repayLoan } from "../controllers/loan.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.post('/apply', protect, applyForLoan);
router.get('/:userId', protect, getLoans);
router.post('/repay', protect, repayLoan);

export default router;