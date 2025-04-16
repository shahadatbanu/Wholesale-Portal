const User = require("../models/User.js");
const Order = require("../models/Order.js");
const Product = require("../models/Product.js");
const bcrypt = require("bcryptjs");

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

const createuser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role,
    });

    res.status(201).json({
      message: `user created successfully`,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create user", error: error.message });
  }
};
// PATCH /api/admin/users/:id → Update wholesaler
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
   const allowedRoles = ["wholesaler", "retailer"];
    const user = await User.findOne({ _id: id, role: { $in: allowedRoles } });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    // Update only fields provided
    if (updates.name) user.name = updates.name;
    if (updates.email) user.email = updates.email;

    await user.save();

    res.status(200).json({
      message: "user updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user", error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name email")
      .populate("items.product");

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

// GET /api/admin/orders/wholesaler/:id
const getOrdersByWholesaler = async (req, res) => {
  try {
    const wholesalerId = req.params.id;

    // Find all products by this wholesaler
    const products = await Product.find({ wholesaler: wholesalerId }).select("_id");
    const productIds = products.map((p) => p._id);

    // Find all orders that include any of these products
    const orders = await Order.find({ "items.product": { $in: productIds } })
      .populate("customer", "name email")
      .populate("items.product");

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders for wholesaler", error: error.message });
  }
};
// DELETE /api/admin/orders/:id
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order", error: error.message });
  }
};



module.exports = { getAllWholesalers ,deleteUser , getAllProducts , createuser , updateUser ,getAllOrders , getOrdersByWholesaler , deleteOrder };
