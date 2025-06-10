const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./db/database');
const cors = require('cors');
const path = require('path'); // <- move to top

const port = process.env.PORT || 5000;

connectDB();

const app = express();

// CORS setup
app.use(cors({
  origin: 'http://localhost:3000', // <-- typical for React dev server
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API routes
app.use('/api/users', require('./routes/user'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/pipelines', require('./routes/pipelines'));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend/build')));

// React SPA catch-all (must come *after* all API routes)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});

// Start server (must come last)
app.listen(port, () => console.log(`Server listening on port ${port}!`));
