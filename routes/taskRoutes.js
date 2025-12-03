const express = require("express");
const TaskController = require("../controllers/TaskController");
const { protect } = require("../middleware/auth");
const router = express.Router();

router.post("/", protect, TaskController.createTask);
router.get("/", protect, TaskController.getAllTasks);
router.get("/:id", protect, TaskController.getTaskById);
router.put("/:id", protect, TaskController.updateTask);
router.delete("/:id", protect, TaskController.deleteTask);

// Additional routes for marking complete/pending
router.put("/:id/complete", protect, TaskController.markComplete);
router.put("/:id/pending", protect, TaskController.markPending);

module.exports = router;
