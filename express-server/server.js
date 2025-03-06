process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Load module dependencies
const express = require('./config/express');
const mongoose = require('./config/mongoose');
const cors = require('cors');

// Create a new mongoose connection instance
const db = mongoose();

// Create a new express application instance
const app = express();

// Configure CORS before any routes
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Use the Express application instance to listen to the '5001' port
app.listen(5001);

// Use the module.exports property to expose our Express application instance for external usage
module.exports = app;

// Log the server status to the console
console.log('Server running at http://localhost:5001/');