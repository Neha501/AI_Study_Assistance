const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/subscriptionController");
const auth = require("../middleware/authMiddleware"); // Assuming you have an auth middleware

router.get("/", auth, subscriptionController.getSubscription);
router.post("/update", auth, subscriptionController.updateSubscription);
router.post("/cancel", auth, subscriptionController.cancelSubscription);
router.post("/initiate-payment", auth, subscriptionController.initiatePayment);
router.post("/verify-payment", auth, subscriptionController.verifyPayment);

module.exports = router;
