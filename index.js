import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./database/dbConfig.js";
import authRoute from "./routers/authRoute.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.get("/", (req, res) => {
  res.send("Welcome to Backend (Password reset Flow)");
});

const port = process.env.PORT || 5000;

app.use("/api/auth", authRoute);

app.listen(port, ()=>{
    console.log(`Server Started on ${port}`);
})