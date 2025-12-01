import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
    username: { type: String, required: true },
    customerName: { type: Array, required: true },
})

export default mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);