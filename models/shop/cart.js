import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
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
    username: { type: String, required: true },
    sales: {type: Number, default: 0},
    categories: {type: Array, default: []},
    actualProductId: { type: String, required: true } 
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Cart ||
  mongoose.model("Cart", CartSchema);