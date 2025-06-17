// backend/server.js

const express = require('express');
const dotenv = require('dotenv').config(); // Load environment variables
const connectDB = require('./db/database'); // Your MongoDB connection file
const cors = require('cors'); // For Cross-Origin Resource Sharing
const path = require('path'); // Node.js path module
const app = express(); // Initialize Express app

// --- Configuration ---
const port = process.env.PORT || 5000; // Use port from .env or default to 5000

// --- Database Connection ---
// It's good practice to ensure the DB connection is established before starting the server
connectDB()
  .then(() => {
    console.log('MongoDB connection established successfully.');
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
    process.exit(1); // Exit process with failure
  });

// --- Middleware ---

// CORS setup: IMPORTANT for frontend communication in development
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from your Vite frontend development server
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow cookies/authorization headers to be sent
}));

// Body parsers for incoming request data
app.use(express.json()); // Parses JSON request bodies
app.use(express.urlencoded({ extended: false })); // Parses URL-encoded request bodies

// --- API Routes ---

// Mount your route files
// IMPORTANT: Ensure these files exist and export an Express Router
app.use('/api/users', require('./routes/user'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/pipelines', require('./routes/pipelines'));

// --- Frontend Serving (for production deployment only) ---
// In development, your Vite server handles the frontend.
// This block ensures Express serves the React build only when deployed.
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the frontend/build directory
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // For any other GET request not handled by API routes, serve the React app's index.html
  // This allows client-side routing to work.
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
} else {
  // In development, provide a simple message for the root URL of the backend
  // As the frontend is served by its own dev server.
  app.get('/', (req, res) => {
    res.status(200).json({ message: 'Backend API is running. Access frontend at http://localhost:5173' });
  });
}

// --- Global Error Handler Middleware ---
// This catches errors passed by `next(error)` from your controllers.
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging
  const statusCode = res.statusCode ? res.statusCode : 500; // Use existing status code or default to 500
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack, // Don't send stack in production
  });
});

// --- Start Server ---
app.listen(port, () => console.log(`Server listening on port ${port}!`));