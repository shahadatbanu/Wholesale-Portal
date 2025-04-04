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



// update product controller

// @desc    Update product details
// @route   PUT /api/products/:id
// @access  Wholesaler only
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const wholesalerId = req.user._id; // Logged-in wholesaler

    // Find the product by ID
    let product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the logged-in user is the product owner (wholesaler)
    if (product.wholesaler.toString() !== wholesalerId.toString()) {
      return res.status(403).json({ message: "Not authorized to update this product" });
    }

    // Update only the provided fields
    product = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("wholesaler", "name email"); // Fetch all products & include wholesaler details

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Wholesaler only (Can delete only their own products)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const wholesalerId = req.user._id; // Logged-in wholesaler

    // Find the product by ID
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the logged-in user is the product owner (wholesaler)
    if (product.wholesaler.toString() !== wholesalerId.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this product" });
    }

    // Delete the product
    await product.deleteOne();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = { addProduct , updateProduct , getAllProducts , deleteProduct};