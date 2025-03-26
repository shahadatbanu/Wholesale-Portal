const productSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      category: { type: String, required: true },
      stock: { type: Number, required: true },
      wholesaler: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to wholesaler
    },
    { timestamps: true }
  );
  
  const Product = mongoose.model("Product", productSchema);
  module.exports = Product;
  