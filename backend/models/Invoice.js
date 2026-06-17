const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema (
    {
        invoiceNumber: {

        },

        customerName: {
            type: String,
            required: [true, "Customer name is required"],
        },

        description: {
            type: String, 
            required: [true, "Invoice description is required"],
        },

        amount: {

        },

        dueDate: {
            type: Date,
            required: [true, "Due date is required"]

        },

        status: {
            type: String,
            default: "Pending",

        },
        
    }
)