import express from "express"
import { loginUser, registerUser, changePassword } from "../controllers/auth-controller.js";
import authMiddleware from "../middleware/auth-middleware.js";

const router = express.Router();

// All routes related to Authentication and Authorization 
router.post('/register', registerUser);
router.post('/login',loginUser);
router.post('/change-password', authMiddleware, changePassword)

export default router;
