const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// ─── Google Strategy ───────────────────────────────────────────────────────────
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists with this Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
            return done(null, user);
        }

        // Check if user exists with same email
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        if (email) {
            user = await User.findOne({ email });
            if (user) {
                // Link Google ID to existing account
                user.googleId = profile.id;
                await user.save();
                return done(null, user);
            }
        }

        // Create new user
        user = await User.create({
            name: profile.displayName || "Google User",
            email: email || `google_${profile.id}@noemail.com`,
            googleId: profile.id
        });

        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

// ─── GitHub Strategy ───────────────────────────────────────────────────────────
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/api/auth/github/callback",
    scope: ["user:email"]
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists with this GitHub ID
        let user = await User.findOne({ githubId: profile.id });

        if (user) {
            return done(null, user);
        }

        // Get primary email
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        if (email) {
            user = await User.findOne({ email });
            if (user) {
                // Link GitHub ID to existing account
                user.githubId = profile.id;
                await user.save();
                return done(null, user);
            }
        }

        // Create new user
        user = await User.create({
            name: profile.displayName || profile.username || "GitHub User",
            email: email || `github_${profile.id}@noemail.com`,
            githubId: profile.id
        });

        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

module.exports = passport;
