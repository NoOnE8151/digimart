import { NextResponse } from "next/server";
import { connectDB } from "@/connections/connectDB";
import Product from "@/models/product";

export async function POST(request) {
  try {
    const { productId, quantity } = await request.json();

    if (!productId) {
      return NextResponse.json({
        success: false,
        message: "Product ID was not provided",
      });
    }

    await connectDB();

    // find product first
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({
        success: false,
        message: "Product not found",
      });
    }

    // increment sales count
    product.sales = (product.sales || 0) + quantity;
    await product.save();

    return NextResponse.json({
      success: true,
      message: "Successfully updated sale count for this product",
      updatedProduct: product,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
