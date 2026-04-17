import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose"; 
import cors from "cors"; 

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config(); 

const app = express(); 

app.use(express.json()); 

app.use(cors()); 

// Simple test route
app.get("/", (req, res) => {
  res.send("Human Being. NP is API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
