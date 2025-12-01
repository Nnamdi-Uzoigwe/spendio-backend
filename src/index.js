// src/index.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const incomeRoutes = require("../routes/incomeRoutes");
const expenseRoutes = require("../routes/expenseRoutes");
const taskRoutes = require("../routes/taskRoutes");
const profileRoutes = require("../routes/profileRoutes");
const authRoutes = require("../routes/authRoutes");
const transactionRoutes = require("../routes/transactionRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",        // local dev
      "https://spendio-app.vercel.app", // your deployed frontend
    ],
    methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/spendio');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

//endpoints
app.use("/api/auth", authRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/transactions", transactionRoutes);

console.log("✅ All routes registered, including /api/transactions"); 


// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Spendio API is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
