import express from "express"; // import express framework
import dotenv from "dotenv"; // load environment variables
import mongoose from "mongoose"; // MongoDB connection
import cors from "cors"; // allow frontend requests

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config(); // read .env file

const app = express(); // create server

app.use(express.json()); // This allows us to read JSON data from requests

app.use(cors()); // Allows frontend (React) to talk to backend

// Simple test route
app.get("/", (req, res) => {
  res.send("Human API is running...");
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
