// models/Product.js

import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnail: { 
      url: {type: String},
      productId: {type: String}
     },
    type: { type: String, required: true },
    product: { 
      url: { type: String, required: true },
      publicId: { type: String, required: true }
     },
    userId: { type: String, required: true },
    sales: {type: Number, default: 0},
    categories: {type: Array, default: []}
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite in development (Next.js hot reload)
export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
