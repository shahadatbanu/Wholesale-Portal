const Product = require("../models/Product.js");

// @desc    Add a new product
// @route   POST /api/products
// @access  Wholesaler only
const addProduct = async (req, res) => {
  try {
    const { name, price, category, stock } = req.body;
    const wholesalerId = req.user._id; // Assuming authentication middleware sets `req.user`

    // Check if all required fields are present
    if (!name || !price || !category || !stock) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new product
    const product = new Product({
      name,
      price,
      category,
      stock,
      wholesaler: wholesalerId, // Associate with logged-in wholesaler
    });

    // Save to the database
    await product.save();

    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = { addProduct };