const Payment = require("../models/Payment");
const Invoice = require("../models/Invoice");

exports.createPayment = async (req, res) => {
  try {
    const { paymentItems, amountPaid } = req.body;

    // Create a new payment
    const payment = new Payment({
        invoiceNumber,
        paymentItems,
        amountPaid,
        status: "Pending",
    });

    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    // Show latest payments first
    const payments = await Payment.find().sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update payment status based on invoice
exports.updatePaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const invoice = await Invoice.findOne({
      invoiceNumber: payment.invoiceNumber,
    });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Keep payment status in sync with invoice
    if (invoice.status !== "Paid" && new Date() > invoice.dueDate) {
      invoice.status = "Overdue";
      await invoice.save();
    }

    payment.status = invoice.status;
    await payment.save();

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete payment once invoice is paid
exports.deletePaymentOncePaid = async (req, res) => {
  try {
    // Find payment
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({message: "Payment not found"});
    }

    // Find corresponding invoice
    const invoice = await Invoice.findOne({
      invoiceNumber: payment.invoiceNumber,
    });

    if (!invoice) {
      return res.status(404).json({message: "Invoice not found"});
    }

    // Only allow deletion if the invoice has been paid
    if (invoice.status !== "Paid") {
      return res.status(400).json({ message: "Cannot delete payment until the invoice is paid."});
    }

    await payment.deleteOne();

    res.json({message: "Payment deleted successfully."});
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

