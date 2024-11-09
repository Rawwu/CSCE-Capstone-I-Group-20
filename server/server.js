const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routers for different routes
const flightsRouter = require('./routes/flights');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register')

// Create an instance of the Express application
const app = express();

// Set up middleware
app.use(cors());
app.use(express.json());

// Set up MongoDB connection
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

// Define routes
app.use('/flights', flightsRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);

// Start the Express server
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});