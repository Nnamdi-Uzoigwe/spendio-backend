// const express = require("express");
// const ProfileController = require("../controllers/ProfileController");

// const router = express.Router();

// router.post("/", ProfileController.createProfile);
// router.get("/", ProfileController.getAllProfiles);
// router.get("/:id", ProfileController.getProfileById);
// router.put("/:id", ProfileController.updateProfile);
// router.delete("/:id", ProfileController.deleteProfile);

// // Balance & tasks
// router.put("/:id/income", ProfileController.addIncome);
// router.put("/:id/expense", ProfileController.addExpense);
// router.put("/:id/task/increment", ProfileController.incrementCompletedTasks);
// router.put("/:id/task/decrement", ProfileController.decrementCompletedTasks);

// module.exports = router;



const express = require("express");
const ProfileController = require("../controllers/ProfileController");
const { protect } = require("../middleware/auth"); // Import the middleware

const router = express.Router();

// Add protect middleware to all routes that need authentication
router.post("/", protect, ProfileController.createProfile);
router.get("/", protect, ProfileController.getAllProfiles);
router.get("/:id", protect, ProfileController.getProfileById);
router.put("/:id", protect, ProfileController.updateProfile);
router.delete("/:id", protect, ProfileController.deleteProfile);

// Balance & tasks
router.put("/:id/income", protect, ProfileController.addIncome);
router.put("/:id/expense", protect, ProfileController.addExpense);
router.put("/:id/task/increment", protect, ProfileController.incrementCompletedTasks);
router.put("/:id/task/decrement", protect, ProfileController.decrementCompletedTasks);

module.exports = router;