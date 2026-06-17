const express = require("express");
const invoiceController = require("../controllers/invoiceController");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

/* Invoice routes */

// Get all invoices
router.get("/", invoiceController.getInvoices);

// Create a invoice with PDF upload
router.post("/", upload.single("PDF"), invoiceController.createInvoice);

// Update invoice details or PDF
router.put("/:invoiceNumber", upload.single("PDF"), invoiceController.updateInvoice);

// Delete a invoice
router.delete("/:invoiceNumber", invoiceController.deleteInvoice);

module.exports = router;