// /models/Seller.js
import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
    },

    pan: {
      type: String,
      required: true,
    },

    bankAccount: {
      account_number: {
        type: String,
        required: true,
      },
      ifsc_code: {
        type: String,
        required: true,
      },
      beneficiary_name: {
        type: String,
        required: true,
      },
    },

    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postal_code: { type: String, required: true },
      country: {
        type: String,
        default: "IN",
      },
    },

    razorpayAccountId: {
      type: String, 
      required: false,
    },

    onboardingStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },

    kycStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Seller = mongoose.models.Seller || mongoose.model("Seller", sellerSchema);
export default Seller;
