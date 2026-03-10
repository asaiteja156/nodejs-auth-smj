import express from "express"
import authMiddleware from "../middleware/auth-middleware.js";

const router = express.Router();

router.get('/welcome', authMiddleware, (req,res)=>{
   const {userInfo} = req;
    res.json({
        message : 'welcome to the home page',
        userinfo : userInfo
    })
})

export default router;
