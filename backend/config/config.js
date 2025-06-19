const dotenv = require("dotenv");

// Load env vars
dotenv.config();

module.exports = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5003,
  mongoUri:
    process.env.MONGO_URI ||
    "mongodb+srv://jaden:admin@cluster0.abrvs.mongodb.net/job-tracker2",
  jwtSecret: process.env.JWT_SECRET || "your-secret-key-minimum-32-chars-long",
  jwtExpire: process.env.JWT_EXPIRE || "1h",
  jwtCookieExpire: process.env.JWT_COOKIE_EXPIRE || 30, // 30 days
  emailFrom: process.env.EMAIL_FROM || "noreply@jobtracker.com",
  smtpHost: process.env.SMTP_HOST || "smtp.mailtrap.io",
  smtpPort: process.env.SMTP_PORT || 2525,
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
};
