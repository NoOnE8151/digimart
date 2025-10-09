import mongoose from "mongoose";

const LibrarySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnail: { 
      url: {type: String},
      publicId: {type: String}
     },
    type: { type: String, required: true },
    product: { 
      url: { type: String, required: true },
      publicId: { type: String, required: true }
     },
    username: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite in development (Next.js hot reload)
export default mongoose.models.Library ||
  mongoose.model("Library", LibrarySchema);
