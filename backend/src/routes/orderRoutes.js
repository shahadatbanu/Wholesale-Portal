const express = require("express");
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  getWholesalerOrders,
  updateOrderStatus
} = require("../controllers/orderController");
const { protect,wholesalerOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

// Retailer routes
router.post("/", protect, placeOrder);          // Place new order
router.get("/my", protect, getMyOrders);        // View own orders
router.get("/:id", protect, getOrderById);      // View single order
router.get("/wholesaler/orders", protect, wholesalerOnly, getWholesalerOrders);
router.patch("/:id", protect, wholesalerOnly, updateOrderStatus); // Delete product route

module.exports = router;
