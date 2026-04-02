import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sendEmail from "../utils/mailer.js";

dotenv.config();

export const Register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (name === "" || email === "" || password === "")
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res
      .status(201)
      .json({ message: "User registered successfully", data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email === "" || password === "")
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found, Please Register." });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res
      .status(200)
      .json({ message: "Login Successfull", token: token, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const ForgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Create reset URL
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${user._id}/${resetToken}`;

    // Send email
    await sendEmail(
      user.email,
      "Reset Password",
      `Click the link below to reset your password:

${resetURL}

This link will expire in 1 hour.

If you did not request this, please ignore this email.`
    );

    res.status(200).json({
      message: "Reset password link sent to your email",
    });

  } catch (error) { 
    console.log(error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const ResetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  try {

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if token belongs to same user
    if (decoded._id !== id) {
      return res.status(400).json({ message: "Invalid reset link" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password
    const UpdatedUser = await User.findByIdAndUpdate(id, {
      password: hashedPassword,
    });

    res.status(200).json({
      message: "Password reset successful", data: UpdatedUser
    });

  } catch (error) {

    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Reset link expired" });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ message: "Invalid reset token" });
    }

    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

