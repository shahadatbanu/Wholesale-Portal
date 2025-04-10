const express = require("express");
const {getAllWholesalers ,deleteUser , getAllProducts } = require("../controllers/adminController");
const { protect, adminOnly } = require("../middlewares/authMiddleware"); // Middleware for auth & role-based access

const router = express.Router();
router.use(protect, adminOnly);
// Route: Get all wholesalers
router.get("/wholesaler", getAllWholesalers); // Only admins can access this route
router.delete("/users/:id", deleteUser);
router.get("/products", getAllProducts);


module.exports = router;
