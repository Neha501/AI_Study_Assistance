require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("./config/passportConfig");

const app = express();

app.use(express.json());

const normalizeOrigin = (value) => (value || "").trim().replace(/\/+$/, "");

const allowedOrigins = [
    "http://localhost:3000",
    process.env.FRONTEND_URL
]
    .map(normalizeOrigin)
    .filter(Boolean);

if (process.env.ADDITIONAL_CORS_ORIGINS) {
    const extraOrigins = process.env.ADDITIONAL_CORS_ORIGINS
        .split(",")
        .map(normalizeOrigin)
        .filter(Boolean);
    allowedOrigins.push(...extraOrigins);
}

app.use(cors({
    origin(origin, callback) {
        const normalizedOrigin = normalizeOrigin(origin);
        if (!origin || allowedOrigins.includes(normalizedOrigin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
}));

app.set("trust proxy", 1);

app.use(session({
    secret: process.env.JWT_SECRET || "fallback-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
    res.send("AI Study Assistance API is running...");
});

app.post("/test", (req, res) => {
    res.send("Test route working");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/study", require("./routes/studyRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/subscription", require("./routes/subscriptionRoutes"));

mongoose.set("bufferCommands", false);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => {
        console.error("MongoDB connection error:", err.message);
    });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
