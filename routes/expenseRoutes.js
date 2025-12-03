const express = require("express");
const ExpenseController = require("../controllers/ExpenseController");
const { protect } = require("../middleware/auth");
const router = express.Router();

router.post("/", protect, ExpenseController.createExpense);

router.get("/monthly", protect, ExpenseController.getMonthlyExpense);
router.get("/by-month", protect, ExpenseController.getExpenseByMonth);

router.get("/", protect, ExpenseController.getAllExpense);

router.get("/:id", protect, ExpenseController.getExpenseById);
router.put("/:id", protect, ExpenseController.updateExpense);
router.delete("/:id", protect, ExpenseController.deleteExpense);

module.exports = router;
