const Study = require("../models/Study");

exports.getAnalytics = async (req, res) => {
    try {
        const totalNotes = await Study.countDocuments({ userId: req.user.id });
        const favorites = await Study.countDocuments({ userId: req.user.id, isFavorite: true });
        res.json({ totalNotes, favorites });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.getWeeklyStats = async (req, res) => {
    try {
        // Simulated weekly stats for now
        const stats = [
            { day: "Mon", count: 2 },
            { day: "Tue", count: 5 },
            { day: "Wed", count: 3 },
            { day: "Thu", count: 8 },
            { day: "Fri", count: 4 },
            { day: "Sat", count: 6 },
            { day: "Sun", count: 2 }
        ];
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
