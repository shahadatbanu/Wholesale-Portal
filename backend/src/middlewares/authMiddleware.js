const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// Middleware to protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
});

// Middleware to allow only wholesalers
const wholesalerOnly = (req, res, next) => {
  if (req.user && req.user.role === "wholesaler") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Only wholesalers can add products." });
  }
};

module.exports = { protect, wholesalerOnly };
