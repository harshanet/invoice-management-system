const Invoice = require("../models/Invoice");

// Create a new Invoice
exports.createInvoice = async (req, res) => {
  try {
    console.log("Body:", req.body);
    console.log("File:", req.file);

    const {

    } = req.body;

    const invoice = new Invoice({

    });
  } catch (error) {
    res.status(500).json({message: error.message});
  }
  //hello d
}

// Read a new Invoice
exports.getInvoices = async (req, res) => {
  //hello d
}

// Update a Invoice
exports.updateInvoice = async (req, res) => {
  //hello d
}

// Archive (instead of Delete)