const express = require("express");
const { getProfile, updateProfile, updateSettings, updatePassword } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.put("/settings", authMiddleware, updateSettings);
router.put("/update-password", authMiddleware, updatePassword);

module.exports = router;
