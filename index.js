import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./database/dbConfig.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.get('/', (req, res)=>{
    res.status(200).json({message: "Welcome to Backend"});
})

const port = process.env.PORT || 5000;

app.listen(port, ()=>{
    console.log(`Server Started on ${port}`);
})