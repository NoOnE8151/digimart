import { NextResponse } from "next/server";
import Product from "@/models/product";
import { connectDB } from "@/connections/connectDB";

export async function POST(request) {
  try {
    await connectDB();
    const { productId } = await request.json();

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return NextResponse.json({
        success: false,
        message: "Product not found or already deleted"
      });
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
      deletedProduct
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: "Internal server error"
    });
  }
}
