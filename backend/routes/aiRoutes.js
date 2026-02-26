const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { generateNotes } = require("../controllers/aiController");

router.post("/generate", auth, generateNotes);

module.exports = router;