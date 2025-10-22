import mongoose from "mongoose";

const EarningSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    earnings: [
      {
        date: {
          type: String,
          default: () => new Date().toISOString().split("T")[0],
        },
        earnings: { type: Number, default: 0, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Earnings ||
  mongoose.model("Earnings", EarningSchema);
