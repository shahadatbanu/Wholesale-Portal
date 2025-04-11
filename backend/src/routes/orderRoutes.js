const express = require("express");
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  getWholesalerOrders
} = require("../controllers/orderController");
const { protect,wholesalerOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

// Retailer routes
router.post("/", protect, placeOrder);          // Place new order
router.get("/my", protect, getMyOrders);        // View own orders
router.get("/:id", protect, getOrderById);      // View single order
router.get("/wholesaler/orders", protect, wholesalerOnly, getWholesalerOrders);

module.exports = router;
