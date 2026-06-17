const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        invoiceNumber: {
            type: Number,
            required: [true, "Invoice number is required"],
            ref: "Invoice",
        },

        paymentItems: [
            {
                paymentDate: {
                    type: Date,
                    required: true,
                },

                paymentMethod: {
                    type: String,
                    required: true,
                    enum: [
                        "Cash",
                        "Credit Card",
                        "Debit Card",
                        "Bank Transfer",
                        "Cheque",
                        "PayPal",
                    ],
                },

                referenceNumber: {
                    type: String,
                    required: true,
                    trim: true,
                },
            },
        ],

        amountPaid: {
            type: Number,
            required: [true, "Amount paid is required"],
            min: [0, "Amount paid cannot be negative"],
        },

        status: {
            type: String, 
            enum: ["Pending", "Paid", "Overdue"],
            default: "Pending",
        },

    },

    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Payment", paymentSchema);
