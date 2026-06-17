const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
  try {
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const { name, description, price, category, stock } = req.body;

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,

      // Save uploaded image if there is one
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const Invoice = require("../models/Invoice");

// Create a new Invoice
exports.createInvoice = async (req, res) => {
  try {
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const {taxInvoiceDisplayed, businessName, ABNCheck, issueDate, description, GST, totalAmountPayableInclude, GST, 
      dueDate, invoiceNumber, status} = req.body;

    const invoice = new Invoice({
      taxInvoiceDisplayed, 
      businessName, 
      ABNCheck, 
      issueDate, 
      description, 
      GST, 
      totalAmountPayableIncludeGST, 
      dueDate, 
      invoiceNumber, 
      status,

      // Save uploaded invoice if there is one
      PDF: req.file ? `/uploads/${req.file.filename}` : "",
    });

    await invoice.save();
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message});
  }
};

// Read a new Invoice
exports.getInvoices = async (req, res) => {
  try {
    const {date, number} = req.query;
    const query = {};

    // Search issue date
    if (date) {
      query.issueDate = issueDate;
    }

    // Filter by invoice number
    if (number) {
      query.invoiceNumber = invoiceNumber;
    }

    const invoices = await Invoice.find(query);
    res.json(invoices);
  } catch {
    res.status(500).json({ message: error.message });
  }
};

// Update a Invoice
exports.updateInvoice = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Update invoice if a new file is uploaded
    if (req.file) {
      updateData.PDF = `/uploads/${req.file.filename}`;
    }

    const invoice = await Invoice.findOneAndUpdate(
      { invoiceNumber: req.params.invoiceNumber },
      updateData,
      { 
        new: true,
        runValidators: true,
      }
    );

    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a Invoice
exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete({
      invoiceNumber: req.params.invoiceNumber,
    });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.json({ message: "Invoice deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};