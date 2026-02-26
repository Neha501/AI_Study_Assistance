const express = require("express");
const { getAllUsers, deleteUser, getSystemStats } = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

// Simple role-based middleware
const adminMiddleware = async (req, res, next) => {
    const User = require("../models/User");
    try {
        const user = await User.findById(req.user.id);
        if (user && user.role === "admin") {
            next();
        } else {
            res.status(403).json({ message: "Access denied. Admin only." });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const router = express.Router();

router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.delete("/users/:id", authMiddleware, adminMiddleware, deleteUser);
router.get("/stats", authMiddleware, adminMiddleware, getSystemStats);

module.exports = router;
