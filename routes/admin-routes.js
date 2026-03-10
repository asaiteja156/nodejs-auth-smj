import express from "express"
import authMiddleware from "../middleware/auth-middleware.js";
import adminMiddleware from "../middleware/admin-middleware.js";

const router = express.Router();

router.get('/welcome', authMiddleware, adminMiddleware, (req,res) => {
    res.json({
        message : 'Welcome to the admin page'
    })
})

export default router;