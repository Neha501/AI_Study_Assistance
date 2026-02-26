const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { register, login } = require("../controllers/authController");

const router = express.Router();

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

router.post("/register", register);
router.post("/login", login);

router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: `${frontendUrl}/login?error=google_failed` }),
    (req, res) => {
        const token = jwt.sign(
            { id: req.user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        res.redirect(`${frontendUrl}/auth/callback?token=${token}&role=${req.user.role}`);
    }
);

router.get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
    "/github/callback",
    passport.authenticate("github", { failureRedirect: `${frontendUrl}/login?error=github_failed` }),
    (req, res) => {
        const token = jwt.sign(
            { id: req.user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        res.redirect(`${frontendUrl}/auth/callback?token=${token}&role=${req.user.role}`);
    }
);

module.exports = router;