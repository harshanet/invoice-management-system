/*const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
//app.use('/api/tasks', require('./routes/taskRoutes'));

// Export the app object for testing
if (require.main === module) {
    connectDB();
    // If the file is run directly, start the server
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }


module.exports = app*/

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const invoiceRoutes = require("./routes/invoiceRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// Load environment variables
dotenv.config();

const app = express();

/* Middleware */
app.use(cors());

// Read JSON data
app.use(express.json());

// Access uploaded images
app.use("/uploads", express.static("uploads"));

/* Routes */
app.use('/api/auth', require('./routes/authRoutes'));
app.use("/api/invoices", invoiceRoutes);
app.use("/api/payments", paymentRoutes);

/* Start server */
if (require.main === module) {

    // Connect to MongoDB
    connectDB();

    const PORT = process.env.PORT || 5001;

    app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
}

module.exports = app;
