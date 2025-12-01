const express = require("express");
const TaskController = require("../controllers/TaskController");

const router = express.Router();

router.post("/", TaskController.createTask);
router.get("/", TaskController.getAllTasks);
router.get("/:id", TaskController.getTaskById);
router.put("/:id", TaskController.updateTask);
router.delete("/:id", TaskController.deleteTask);

// Additional routes for marking complete/pending
router.put("/:id/complete", TaskController.markComplete);
router.put("/:id/pending", TaskController.markPending);

module.exports = router;
