import { NextResponse } from "next/server";
import { connectDB } from "@/connections/connectDB";
import Product from "@/models/product";

export async function GET() {
  try {
    await connectDB();
    
    // fetch all products sorted by 'sales' in descending order
    const products = await Product.find().sort({ sales: -1 });

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch products, internal server error",
    });
  }
}
