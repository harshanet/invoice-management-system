const express = require("express");
const invoiceController = require("../controllers/invoiceController");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

/* Product routes */

// Get all invoices
router.get("/", invoiceController.getInvoices);

// Create a invoice with PDF upload
router.post("/", upload.single("PDF"), invoiceController.createInvoice);

// Update invoice details or PDF
router.put("/:id", upload.single("PDF"), invoiceController.updateInvoice);

// Delete a invoice
router.delete("/:id", invoiceController.deleteInvoice);

module.exports = router;