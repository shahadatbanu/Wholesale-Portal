const express = require("express");
const { addProduct , updateProduct , getAllProducts , deleteProduct } = require("../controllers/productController");
const { protect, wholesalerOnly } = require("../middlewares/authMiddleware"); // Middleware for auth & role-based access

const router = express.Router();

router.post("/", protect, wholesalerOnly, addProduct); // Only wholesalers can add products
router.patch("/:id", protect, wholesalerOnly, updateProduct); // Update product with PATCH
router.get("/", getAllProducts);
router.delete("/:id", protect, wholesalerOnly, deleteProduct); // Delete product route

module.exports = router;
