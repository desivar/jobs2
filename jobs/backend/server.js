const express = require('express');
const dotenv = require('dotenv'); // Import dotenv correctly
const connectDB = require('./db/database');
const cors = require('cors');
const path = require('path'); // Path is already at the top, good!

// Load environment variables as early as possible
dotenv.config();

const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
// CORS setup - should come before other routes to allow all incoming requests
app.use(cors({
    origin: 'http://localhost:3000', // <-- typical for React dev server
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If you're sending cookies or authorization headers
}));

app.use(express.json()); // Body parser for JSON requests
app.use(express.urlencoded({ extended: false })); // Body parser for URL-encoded form data

// API routes - these should come before any static file serving or catch-all routes
app.use('/api/users', require('./routes/user'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/pipelines', require('./routes/pipelines'));

// Serve frontend static files
// This block should only be active when deploying to production
// During development, React's dev server (localhost:3000) serves the frontend
// and this Express server (localhost:5000) serves only the API.
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));

    // React SPA catch-all (must come *after* all API routes)
    // For any request that is not an API route, serve the React app's index.html
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
    });
} else {
    // Development specific route to confirm API is running
    app.get('/', (req, res) => {
        res.send('API is running in development mode!');
    });
}


// Start server (must come last)
app.listen(port, () => console.log(`Server listening on port ${port}!`));