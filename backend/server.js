require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");
const { errorHandler, notFound } = require("./middleware/error");
const morgan = require("morgan");
const config = require("./config/config");
const path = require("path");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const colors = require("colors");

// Import middleware

const userRoutes = require("./routes/users");
const jobRoutes = require("./routes/jobs");
const customerRoutes = require("./routes/customers");
const pipelineRoutes = require("./routes/pipelines");
const applicationRoutes = require("./routes/application");
const dashboardRoutes = require("./routes/dashboard");
const uploadRoutes = require("./routes/upload");
const profileRoutes = require("./routes/profile");

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    credentials: true,
  })
);

// File upload configuration
app.use(
  fileUpload({
    createParentPath: true,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
    abortOnLimit: true,
    responseOnLimit: "File size is too large",
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
const resumesDir = path.join(uploadsDir, "resumes");
if (!require("fs").existsSync(uploadsDir)) {
  require("fs").mkdirSync(uploadsDir);
}
if (!require("fs").existsSync(resumesDir)) {
  require("fs").mkdirSync(resumesDir);
}

// Serve static files from the uploads directory
app.use(
  "/uploads/resumes",
  express.static(path.join(__dirname, "uploads/resumes"))
);

// API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// Mount routes

app.use("/api/users",  userRoutes);
app.use("/api/jobs",  jobRoutes);
app.use("/api/customers",  customerRoutes);
app.use("/api/pipelines",  pipelineRoutes);
app.use("/api/applications",  applicationRoutes);
app.use("/api/dashboard",  dashboardRoutes);
app.use("/api/upload",  uploadRoutes);
app.use("/api/profile",  profileRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = config.port;

// Check if port is in use
const detectPort = (port) => {
  return new Promise((resolve, reject) => {
    const server = require("net").createServer();
    server.once("error", (err) => {
      if (err.code === "EADDRINUSE") {
        resolve(false);
      } else {
        reject(err);
      }
    });
    server.once("listening", () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
};

// Start server with port checking
const startServer = async () => {
  try {
    const isPortAvailable = await detectPort(PORT);
    if (!isPortAvailable) {
      console.log(
        `Port ${PORT} is in use, trying to close existing connections...`
      );
      // Try to close any existing connections
      const { execSync } = require("child_process");
      try {
        if (process.platform === "win32") {
          execSync(`netstat -ano | findstr :${PORT}`);
        } else {
          execSync(
            `lsof -i :${PORT} | grep LISTEN | awk '{print $2}' | xargs kill -9`
          );
        }
      } catch (err) {
        console.log("No existing process found on port", PORT);
      }
    }

    const server = app.listen(PORT, () => {
      console.log(
        `Server running in ${config.env} mode on port ${PORT}`.yellow.bold
      );
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err, promise) => {
      console.log(`Error: ${err.message}`.red);
      // Close server & exit process
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
