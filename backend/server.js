/ backend/server.js

const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./db/database'); // Adjust path if needed
const cors = require('cors'); // <--- ADD THIS LINE

const port = process.env.PORT || 5000;

connectDB();

const app = express();

// CORS Middleware - ADD THIS BLOCK *BEFORE* your routes
app.use(cors({
    origin: 'http://localhost:5500', // IMPORTANT: This must be the exact URL and port of your frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If you're using cookies or sessions
}));

app.use(express.json()); // Middleware for parsing JSON request bodies
app.use(express.urlencoded({ extended: false })); // Middleware for parsing URL-encoded request bodies

// Your API Routes
app.use('/api/users', require('./routes/user'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/pipelines', require('./routes/pipelines'));

// Basic route for the root URL
app.get('/', (req, res) => {
    res.send('API is running');
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));