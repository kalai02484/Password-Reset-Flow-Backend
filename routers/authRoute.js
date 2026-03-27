import express from "express";
import {
    Login,
    Register,
    ForgetPassword,
    ResetPassword,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", Login);
router.post("/register", Register);
router.post("/forget-password", ForgetPassword);
router.post("/reset-password/:id/:token", ResetPassword);

export default router;