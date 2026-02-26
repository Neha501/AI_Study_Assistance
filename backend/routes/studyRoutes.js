const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
    createStudy,
    getAllStudies,
    updateStudy,
    deleteStudy,
    toggleFavorite
} = require("../controllers/studyController");

router.post("/", auth, createStudy);
router.get("/", auth, getAllStudies);
router.put("/:id", auth, updateStudy);
router.put("/:id/favorite", auth, toggleFavorite);
router.delete("/:id", auth, deleteStudy);

module.exports = router;