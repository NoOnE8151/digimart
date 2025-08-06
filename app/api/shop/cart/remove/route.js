import { NextResponse } from "next/server";
import Cart from "@/models/shop/cart";
import Product from "@/models/product";
import { connectDB } from "@/connections/connectDB";

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();

    const cart = await Cart.findByIdAndDelete(data.cartProductId);

    const updatedProduct = await Product.findByIdAndUpdate( data.productId, 
  { $pull: { cart: data.username } } );
console.log('product updated', updatedProduct);


    return NextResponse.json({ success: true, message: "succesfully delete item from cart", cart })
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "internal server error",
    });
  }
}
