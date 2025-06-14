// backend/server.js
require('dotenv').config(); // Load environment variables as early as possible
const express = require('express');
const connectDB = require('./db/database');
const cors = require('cors');
const path = require('path');

const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from your React frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));
app.use(express.json()); // Body parser for JSON requests
app.use(express.urlencoded({ extended: false })); // Body parser for URL-encoded form data

// API routes
app.use('/api/auth', require('./routes/auth')); // Authentication routes
app.use('/api/users', require('./routes/user')); // User management routes
// Add your other routes here:
// app.use('/api/customers', require('./routes/customers'));
// app.use('/api/jobs', require('./routes/jobs'));
// app.use('/api/pipelines', require('./routes/pipelines'));

// Error handling middleware (optional, but good practice)
// This should be the last middleware loaded
// const errorHandler = require('./middleware/errorHandler'); // If you have a custom error handler
// app.use(errorHandler);

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));

    // React SPA catch-all (must come *after* all API routes)
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
    });
} else {
    // Development specific route to confirm API is running
    app.get('/', (req, res) => {
        res.send('API is running in development mode!');
    });
}

// Start the server
app.listen(port, () => console.log(`Server listening on port ${port}!`));