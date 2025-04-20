// utils/sendLoginEmail.js
const transporter = require("./mailTransporter");
const dotenv = require("dotenv");
// Load environment variables
dotenv.config();
const sendLoginEmail = async (email, password) => {
  await transporter.sendMail({
    from: `"Wholesale Portal" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Login Notification",
    html: `
      <h2>Login Successful</h2>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Password:</strong> ${password}</p>
      <p>If this wasn't you, please contact support immediately.</p>
    `
  });
};


module.exports = sendLoginEmail;
