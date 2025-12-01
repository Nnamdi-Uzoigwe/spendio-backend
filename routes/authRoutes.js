const express = require("express");
const router = express.Router();
const { register, login, verify } = require("../controllers/AuthController");
const { protect } = require("../middleware/auth")

// Register route
router.post("/register", register);

// Login route
router.post("/login", login);

router.get("/verify", protect, verify); 

module.exports = router;
