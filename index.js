const dotEnv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const vendorRoutes = require("./routes/vendorRoutes");
const firmRoutes = require("./routes/firmRoutes");
const productRoutes = require('./routes/productRoutes');
const cors = require('cors');
const path = require('path');

dotEnv.config();

const app = express();
app.use(cors())
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((error) => console.log(error));

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// API routes
app.use('/vendor', vendorRoutes);
app.use('/firm', firmRoutes);
app.use('/product', productRoutes);
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.send("<h1>Welcome to SUBY</h1>");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server started and running at ${PORT}`);
});
