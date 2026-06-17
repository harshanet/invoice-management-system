const express = require("express");
const paymentController = require("../controllers/paymentController");

const router = express.Router();

/* Payment routes */

// Create a new payment
router.post("/", paymentController.createPayment);

// Get all payments
router.get("/", paymentController.getPayments);

// Update payment status
router.put("/:id/sync", paymentController.updatePaymentStatus);

// Delete an payment
router.delete("/:id", paymentController.deletePaymentOncePaid);

module.exports = router;