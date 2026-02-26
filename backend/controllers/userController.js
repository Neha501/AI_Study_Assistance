const User = require("../models/User");

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select("-password");
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user.id, { $set: { settings: req.body } }, { new: true });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!(await user.comparePassword(oldPassword))) {
            return res.status(400).json({ message: "Incorrect old password" });
        }
        user.password = newPassword;
        await user.save();
        res.json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
