const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        invoiceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Invoice",
            required: true,
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
            required: true,
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
