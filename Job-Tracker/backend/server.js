// filepath: backend/index.js
const express = require("express");
const cors = require("cors");
const mongodb = require("./db/database"); // Your MongoDB connection setup

const userRoutes = require("./routes/user");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/users", userRoutes); // Use /api/users for clarity

app.get("/", (req, res) => {
  res.send("API is running");
});

// Connect to MongoDB and start server
mongodb.connect((err) => {
  if (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  } else {
    app.listen(5000, () => {
      console.log(`Server listening on port 5000! Connected to MongoDB.`);
    });
  }
});
