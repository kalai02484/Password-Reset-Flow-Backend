import express from "express";
import { getUser, loginUser, registerUser } from "../controllers/authController.js";
import {adminMiddleware} from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/getdata", adminMiddleware, getUser);

export default router;