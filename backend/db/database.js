// db/database.js

const mongoose = require("mongoose");
const config = require("../config/config");
require("dotenv").config();

mongoose.set("strictQuery", true);

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || config.mongoUri;
    if (!uri) {
      throw new Error("MONGODB_URI environment variable is not set!");
    }

    const options = {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
    };

    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri, options);

    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
    });

    // If Node process ends, close the MongoDB connection
    process.on("SIGINT", async () => {
      try {
        await mongoose.connection.close();
        console.log("MongoDB connection closed through app termination");
        process.exit(0);
      } catch (err) {
        console.error("Error closing MongoDB connection:", err);
        process.exit(1);
      }
    });

    return mongoose.connection;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
