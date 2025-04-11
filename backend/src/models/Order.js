const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
    {
      customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to retailer
      items: [
        {
          product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // Reference to Product
          quantity: { type: Number, required: true },
        },
      ],
      total_price: { type: Number, required: true },
      status: { type: String, enum: ["pending", "shipped", "delivered", "cancelled"], default: "pending" },
    },
    { timestamps: true }
  );
  
  const Order = mongoose.model("Order", orderSchema);
  module.exports = Order;
  