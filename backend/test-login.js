const mongoose = require("mongoose");
const User = require("./models/User");
const config = require("./config/config");

async function testLogin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log("Connected to MongoDB");

    // Create a test user if it doesn't exist
    const testUser = {
      username: "testuser",
      email: "test@example.com",
      password: "Test123!",
      firstName: "Test",
      lastName: "User",
      role: "admin",
      department: "IT",
      active: true,
    };

    let user = await User.findOne({ email: testUser.email });
    if (!user) {
      user = new User(testUser);
      await user.save();
      console.log("Test user created");
    }

    // Generate token
    const token = user.generateAuthToken();
    console.log("Generated token:", token);

    // Test token verification
    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, config.jwtSecret);
    console.log("Decoded token:", decoded);

    mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
    mongoose.disconnect();
  }
}

testLogin();
