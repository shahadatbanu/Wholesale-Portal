require('dotenv').config(); // Load environment variables
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role }, // Dynamic payload
        process.env.JWT_SECRET, // Use secret key from .env
        { expiresIn: '1h' } // Token expiry
    );
};

module.exports= generateToken;