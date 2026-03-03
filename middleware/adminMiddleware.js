import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();


export const adminMiddleware = async (req, res, next) => {
  //method 1
  //const token = req.header("Authorization");

  //method 2
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(400).json({ message: "Token Missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      exiresIn: "1hr",
    });

    //console.log("decoded", decoded);

    req.user = decoded;

    const user = await User.findById(req.user._id);

    if (user.role === "Admin") {
      next();
    } else {
      res.status(503).json({ message: "Access denied only admin can view" });
    }
  } catch (error) {
    res
      .status(503)
      .json({ message: "Server Error, something went wrong", error });
  }
};
