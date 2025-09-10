import { Router } from "express";

import { register, login, getProfile, logout } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

// auth routes
router.post('/register', register);
router.post('/login', login)
router.post('/logout', logout)
router.get('/me', protect, getProfile)

export default router;