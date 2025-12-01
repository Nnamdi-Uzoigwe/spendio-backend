const express = require("express");
const IncomeController = require("../controllers/IncomeController");
const { protect } = require("../middleware/auth");
const router = express.Router();

router.post("/", protect, IncomeController.createIncome);
router.get("/", protect, IncomeController.getAllIncome);
router.get("/monthly", protect, IncomeController.getMonthlyIncome)
router.get("/:id", protect, IncomeController.getIncomeById);
router.put("/:id", protect, IncomeController.updateIncome);
router.delete("/:id", protect, IncomeController.deleteIncome);

module.exports = router;
