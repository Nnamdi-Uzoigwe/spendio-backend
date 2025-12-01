const express = require("express");
const router = express.Router();
const TransactionController = require("../controllers/TransactionController");
const { protect } = require("../middleware/auth");

// GET /api/transactions/recent?userId=xxx
router.get("/recent", protect, TransactionController.getRecentTransactions);

module.exports = router;