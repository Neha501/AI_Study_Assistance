require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("./config/passportConfig");
const jwt = require("jsonwebtoken");

const app = express();

// ✅ MUST be before routes
app.use(express.json());

// ✅ Proper CORS setup (use only once)
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5173", "https://ai-study-assistance.vercel.app"],
    credentials: true
}));

// ✅ Session (required for Passport OAuth)
app.use(session({
    secret: process.env.JWT_SECRET || "fallback-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// ✅ Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Health check and Test route
app.get("/", (req, res) => {
    res.send("AI Study Assistance API is running...");
});

app.post("/test", (req, res) => {
    res.send("Test route working");
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/study", require("./routes/studyRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/subscription", require("./routes/subscriptionRoutes"));

console.log("AI route loaded");

// MongoDB connection
mongoose.set("bufferCommands", false);

console.log("Connecting to MongoDB...");
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err.message);
    });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));