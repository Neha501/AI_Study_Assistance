const User = require("../models/User");
const Study = require("../models/Study");

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.getSystemStats = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const studyCount = await Study.countDocuments();
        res.json({ userCount, studyCount });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
