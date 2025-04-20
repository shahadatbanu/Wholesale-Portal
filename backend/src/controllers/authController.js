
const User = require("../models/User.js");
const sendLoginEmail=require("../utils/sendLoginEmail.js");
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = await User.create({ name, email, password, role });
    await sendLoginEmail(email, password);
    if (user) {
     return res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        // token: generateToken(user.id),
      });
    } else {
     return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
   return res.status(500).json({ message:error.message});
  }
};


// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const generateTokens = require("../utils/generateToken");

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate Access & Refresh Tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Store Refresh Token in HTTP-only Cookie (More Secure)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,   // Prevents JavaScript access (XSS protection)
      secure: true,     // Ensures it's sent over HTTPS
      sameSite: "Strict", // Prevents CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days Expiry
    });

    // Send Access Token in Response
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,  //  Includes Access Token
      refreshToken, //  Includes Refresh Token
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports={registerUser,loginUser}
