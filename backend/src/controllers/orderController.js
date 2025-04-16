const Order = require("../models/Order");
const products = require("../models/Product");

// POST /api/orders → Place a new order
const placeOrder = async (req, res) => {
  const { items } = req.body;
  const customerId = req.user._id;
  console.log(customerId);
  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No items in order" });
  }

  try {
    let totalPrice = 0;

    // Calculate total price
    for (const item of items) {
      const product = await products.findById(item.product);
      console.log(product);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      totalPrice += product.price * item.quantity;
      console.log(totalPrice);
    }

    const newOrder = await Order.create({
      customer: customerId,
      items,
      total_price: totalPrice,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to place order", error: err.message });
  }
};

// GET /api/orders/my → View own orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).populate("items.product");
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
};

// GET /api/orders/:id → View single order
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer", "name email")
      .populate("items.product");

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Only allow access to the order if the logged-in user is the owner
    if (String(order.customer._id) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.status(200).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch order", error: err.message });
  }
};

const getWholesalerOrders = async (req, res) => {
    try {
      const wholesalerId = req.user._id;
  
      // Find products owned by this wholesaler
      const wholesalerProducts = await products.find({ wholesaler: wholesalerId }).select("_id");
      const productIds = wholesalerProducts.map((p) => p._id);
  
      // Find orders containing any of these product IDs
      const orders = await Order.find({ "items.product": { $in: productIds } })
        .populate("customer", "name email")
        .populate("items.product");
  
      res.status(200).json({
        success: true,
        count: orders.length,
        orders,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wholesaler orders", error: error.message });
    }
  };
  // update status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update order", error: error.message });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  getWholesalerOrders,
  updateOrderStatus
};
