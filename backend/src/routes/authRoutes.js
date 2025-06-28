import { login, logout, signup ,onboard} from "../controller/authController.js"
import express from "express"
import  protectRoute  from "../middleware/authMiddleware.js"

const router=express.Router()

router.post("/signup",signup)

router.post("/login",login)

router.post("/logout",logout)

router.post("/onboarding", protectRoute,onboard)

router.get("/my",protectRoute,(req,res)=>{
 res.status(200).json({success:true,user:req.user});
})

export default router;