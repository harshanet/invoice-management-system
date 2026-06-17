const mongoose = require("mongoose");

const invoiceSchema = new.mongoose.invoiceSchema (
    {
        taxInvoiceDisplayed: {
            type: String,
            enum: ["Tax Invoice"],
            default: "Tax Invoice",
            required: true,
        },

        businessName: {
            type: String,
            required: [true, "Business name is required"],
        },

        ABNCheck: {
            type: String,
            required: [true, "ABN is required"],
            match: [/^\d{11}$/, "ABN must be exactly 11 digits"], 
        },

        issueDate: {
            type: Date,
            required: [true, "Issue date is required"],
        },

        description: {
            type: String, 
            required: [true, "Invoice description is required"],
        },

        GST: {
            type: Number, 
            required: [true, "GST is required"],
            validate: {
                validator: function(value) {
                    return value === this.totalAmountPayableIncludeGST / 11;
                },
            message: "GST must equal one-eleventh of the total amount payable."
            }, 
            
        },

        totalAmountPayableIncludeGST: {
            type: Number,
            required: [true, "Total amount payable (including GST) is required"],
            min: [0, "Total amount payable cannot be negative"],
        },

        // Additional Attributes for Bookkeeping
        dueDate: {
            type: Date,
            required: [true, "Due date is required"],
        },
        
        invoiceNumber: {
            type: Number,
            required: [true, "Invoice is required"],
            unique: true,
        },

        status: {
            type: String, 
            enum: ["Pending", "Paid", "Overdue"],
            default: "Pending",
        },

        PDF: {
            type: String,

            // Save uploaded pdf path
            default: "",
        },
    },

     // Add createdAt and updatedAt automatically
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Invoice", invoiceSchema);