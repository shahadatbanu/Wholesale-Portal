
const User = require("../models/User.js");

const generateToken = require("../utils/generateToken.js");

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
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: error.message });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports={registerUser,loginUser}
