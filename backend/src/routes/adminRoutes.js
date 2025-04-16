const express = require("express");
const {getAllWholesalers ,deleteUser , getAllProducts , createuser , updateUser , getAllOrders , getOrdersByWholesaler , deleteOrder , updateOrderStatus} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middlewares/authMiddleware"); // Middleware for auth & role-based access

const router = express.Router();
router.use(protect, adminOnly);
// Route: Get all wholesalers
router.get("/wholesaler", getAllWholesalers); // Only admins can access this route
router.delete("/users/:id", deleteUser);
router.get("/products", getAllProducts);
router.post("/users", createuser); // Add wholesaler
router.patch("/users/:id",  updateUser); // Update wholesaler
router.get("/orders",  getAllOrders);
router.get("/orders/wholesaler/:id", getOrdersByWholesaler);
router.patch("/orders/:id", updateOrderStatus);
router.delete("/orders/:id", deleteOrder);


module.exports = router;
