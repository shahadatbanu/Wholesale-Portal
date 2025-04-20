// utils/mailTransporter.js
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
// Load environment variables
dotenv.config();
console.log("bdiwelfberibgrg");
console.log("Email transporter initialized with user:", process.env.EMAIL_USER);
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

module.exports = transporter;
