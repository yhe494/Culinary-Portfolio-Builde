process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Load module dependencies
const express = require('./config/express');
const mongoose = require('./config/mongoose');
const cors = require('cors');
const config = require('./config/env/development');
const path = require('path');
const expressModule = require('express');

const port = process.env.PORT || config.port;
// Create a new mongoose connection instance
const db = mongoose();

// Create a new express application instance
const app = express();

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url} - body:`, req.body);
    next();
});

// Configure CORS
const corsOptions = process.env.NODE_ENV === 'production'
    ? {
        // In production, only allow requests from the same domain
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }
    : {
        // In development, allow cross-origin requests from the frontend
        origin: 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    };

app.use(cors(corsOptions));

// In production, serve the React frontend
if (process.env.NODE_ENV === 'production') {
    // Serve static files from the React app
    app.use(expressModule.static(path.join(__dirname, 'client-react/dist')));

    // For any route not handled by the API, serve the React app
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client-react/dist/index.html'));
    });
}

// Use the Express application instance to listen to the port
app.listen(port);

// Use the module.exports property to expose our Express application instance for external usage
module.exports = app;

// Log the server status to the console
console.log(`Server running on port ${port}`);