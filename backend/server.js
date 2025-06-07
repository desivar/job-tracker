// filepath: backend/index.js
const express = require("express");
const cors = require("cors");
const mongodb = require("./db/database"); // Your MongoDB connection setup
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');

const userRoutes = require("./routes/user");
const pipelineRoutes = require("./routes/pipelines");
const jobroutes = require("./routes/jobs"); 
const customerRoutes = require("./routes/customers"); 

const app = express();
app.use(cors());
app.use(express.json());
app.use("/users", userRoutes); // Use /api/users for clarity
app.use("/pipelines", pipelineRoutes); 
app.use("/jobs", jobroutes); // Use /api/jobs for clarity
app.use("/customers", customerRoutes); // Use /api/customers for clarity
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));





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
