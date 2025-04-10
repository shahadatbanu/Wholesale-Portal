const User = require("../models/User.js");
const Product = require("../models/Product.js");


// @desc    Get all wholesalers
// @route   GET /api/admin/wholesaler
// @access  Admin only
const getAllWholesalers = async (req, res) => {
  try {
    const wholesalers = await User.find({ role: "wholesaler" }).select("-password"); // Exclude password
    res.status(200).json({
      success: true,
      count: wholesalers.length,
      wholesalers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch wholesalers",
      error: error.message,
    });
  }
};


// @desc    Delete a wholesaler by ID
// @route   DELETE /api/admin/users/:id
// @access  Admin only
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "wholesaler") {
      return res.status(400).json({ message: "Only wholesalers can be deleted" });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: `Wholesaler '${user.name}' deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("wholesaler", "name email");

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

module.exports = { getAllWholesalers ,deleteUser , getAllProducts};
