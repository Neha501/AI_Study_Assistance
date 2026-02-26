const Study = require("../models/Study");

exports.createStudy = async (req, res) => {
    try {
        const study = new Study({
            ...req.body,
            userId: req.user.id
        });
        await study.save();
        res.status(201).json(study);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.getAllStudies = async (req, res) => {
    try {
        const studies = await Study.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(studies);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.updateStudy = async (req, res) => {
    try {
        const study = await Study.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            req.body,
            { new: true }
        );
        if (!study) return res.status(404).json({ message: "Study not found" });
        res.json(study);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.deleteStudy = async (req, res) => {
    try {
        const study = await Study.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!study) return res.status(404).json({ message: "Study not found" });
        res.json({ message: "Study deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.toggleFavorite = async (req, res) => {
    try {
        const study = await Study.findOne({ _id: req.params.id, userId: req.user.id });
        if (!study) return res.status(404).json({ message: "Study not found" });
        study.isFavorite = !study.isFavorite;
        await study.save();
        res.json(study);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
