const Subscription = require("../models/Subscription");
const User = require("../models/User");

exports.getSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOne({ userId: req.user.id });
        res.json(subscription || { plan: "free" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.updateSubscription = async (req, res) => {
    const { plan } = req.body;
    try {
        let subscription = await Subscription.findOne({ userId: req.user.id });
        if (subscription) {
            subscription.plan = plan;
            await subscription.save();
        } else {
            subscription = new Subscription({ userId: req.user.id, plan });
            await subscription.save();
        }
        await User.findByIdAndUpdate(req.user.id, { subscriptionStatus: plan });
        res.json(subscription);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.cancelSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOneAndUpdate(
            { userId: req.user.id },
            { status: "cancelled" },
            { new: true }
        );
        await User.findByIdAndUpdate(req.user.id, { subscriptionStatus: "free" });
        res.json(subscription);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.initiatePayment = async (req, res) => {
    // Simulated payment initiation
    res.json({ orderId: "order_" + Date.now(), amount: 999 });
};

exports.verifyPayment = async (req, res) => {
    // Simulated payment verification
    res.json({ message: "Payment verified successfully" });
};
