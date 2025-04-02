const express = require("express");
const { addProduct } = require("../controllers/productController");
const { protect, wholesalerOnly } = require("../middlewares/authMiddleware"); // Middleware for auth & role-based access

const router = express.Router();

router.post("/", protect, wholesalerOnly, addProduct); // Only wholesalers can add products

module.exports = router;
