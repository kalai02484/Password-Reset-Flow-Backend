import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = async (req, res, next) => {
  //method 1
  //const token = req.header("Authorization");

  //method 2
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(400).json({ message: "Token Missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      expiresIn: "1hr",
    });

    console.log("decoded", decoded);

    req.user = await User.findById(decoded._id).select("-password");

    console.log(req.user);

    next();
  } catch (error) {
    res
      .status(503)
      .json({ message: "Server Error, something went wrong", error });
  }
};
