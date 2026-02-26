const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { register, login } = require("../controllers/authController");

const router = express.Router();

const frontendUrl = (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/+$/, "");
const buildErrorRedirect = (code) => `${frontendUrl}/login?error=${code}`;

router.post("/register", register);
router.post("/login", login);

router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback", (req, res, next) => {
    passport.authenticate("google", (err, user) => {
        if (err) {
            console.error("Google OAuth callback error:", err.message);
            return res.redirect(buildErrorRedirect("google_server_error"));
        }
        if (!user) {
            return res.redirect(buildErrorRedirect("google_failed"));
        }
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing in environment");
            return res.redirect(buildErrorRedirect("server_config_error"));
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        return res.redirect(`${frontendUrl}/auth/callback?token=${token}&role=${user.role}`);
    })(req, res, next);
});

router.get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"] })
);

router.get("/github/callback", (req, res, next) => {
    passport.authenticate("github", (err, user) => {
        if (err) {
            console.error("GitHub OAuth callback error:", err.message);
            return res.redirect(buildErrorRedirect("github_server_error"));
        }
        if (!user) {
            return res.redirect(buildErrorRedirect("github_failed"));
        }
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing in environment");
            return res.redirect(buildErrorRedirect("server_config_error"));
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        return res.redirect(`${frontendUrl}/auth/callback?token=${token}&role=${user.role}`);
    })(req, res, next);
});

module.exports = router;
