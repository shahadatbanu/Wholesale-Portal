require("dotenv").config(); // Load environment variables
const jwt = require("jsonwebtoken");

/**
 * Generate Access Token (Short-lived)
 * @param {Object} user - User object containing _id and role
 * @returns {string} - JWT Access Token
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role }, // Payload
    process.env.JWT_SECRET, // Secret Key
    { expiresIn: "1h" } // Expiry Time: 1 Hour
  );
};

/**
 * Generate Refresh Token (Long-lived)
 * @param {Object} user - User object containing _id and role
 * @returns {string} - JWT Refresh Token
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role }, // Payload
    process.env.REFRESH_TOKEN_SECRET, // Separate Secret Key for Refresh Token
    { expiresIn: "7d" } // Expiry Time: 7 Days
  );
};

/**
 * Generate both Access & Refresh Tokens
 * @param {Object} user - User object
 * @returns {Object} - { accessToken, refreshToken }
 */
const generateTokens = (user) => {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
  };
};

module.exports = generateTokens;
