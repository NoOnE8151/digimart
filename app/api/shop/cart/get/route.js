import { NextResponse } from "next/server";
import Cart from "@/models/shop/cart";
import { connectDB } from "@/connections/connectDB";

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();

    const cart = await Cart.find({ username: data.username })

    return NextResponse.json({ success: true, message: "succesfully added item to cart", cart })
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "internal server error",
    });
  }
}
