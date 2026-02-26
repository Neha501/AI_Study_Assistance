const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: String, enum: ["free", "basic", "pro"], default: "free" },
    startDate: { type: Date, default: Date.now },
    expiryDate: { type: Date },
    status: { type: String, enum: ["active", "cancelled", "expired"], default: "active" },
    paymentId: { type: String },
    orderId: { type: String }
});

module.exports = mongoose.model("Subscription", subscriptionSchema);
