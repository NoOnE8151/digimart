import mongoose from "mongoose";

const ShopSchema = new mongoose.Schema(
  {
    username: { type: String },
    name: {type: String},
    description: { type: String },
    image: {
        url: { type: String },
        publicId: { type: String },
    },
    coverImage: { 
      url: { type: String },
      publicId: { type: String }
     },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Shop ||
  mongoose.model("Shop", ShopSchema);