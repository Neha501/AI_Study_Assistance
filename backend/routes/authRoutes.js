const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { register, login } = require("../controllers/authController");

const router = express.Router();

// REGISTER
router.post("/register", register);

// LOGIN
router.post("/login", login);

// ─── Google OAuth ──────────────────────────────────────────────────────────────
router.get("/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback",
    passport.authenticate("google", { failureRedirect: "http://localhost:3000/login?error=google_failed" }),
    (req, res) => {
        // Successful authentication: create JWT and redirect to frontend
        const token = jwt.sign(
            { id: req.user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        // Redirect to frontend with token in query param; frontend stores it
        res.redirect(`http://localhost:3000/auth/callback?token=${token}&role=${req.user.role}`);
    }
);

// ─── GitHub OAuth ──────────────────────────────────────────────────────────────
router.get("/github",
    passport.authenticate("github", { scope: ["user:email"] })
);

router.get("/github/callback",
    passport.authenticate("github", { failureRedirect: "http://localhost:3000/login?error=github_failed" }),
    (req, res) => {
        // Successful authentication: create JWT and redirect to frontend
        const token = jwt.sign(
            { id: req.user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        res.redirect(`http://localhost:3000/auth/callback?token=${token}&role=${req.user.role}`);
    }
);

module.exports = router;
