import { NextResponse } from "next/server";
import Cart from "@/models/shop/cart";
import Product from "@/models/product";
import { connectDB } from "@/connections/connectDB";

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();

    let cart;
    for (const id of data.productIds) {
      const cartItem = await Cart.findById(id);
      
      //remove username from product's cart field
      let updatedProduct = await Product.findByIdAndUpdate(
       cartItem.actualProductId,
       { $pull: { cart: data.username } },
       { new: true }
     );
       cart = await Cart.findByIdAndDelete(id);
    }

    return NextResponse.json({
      success: true,
      message: "succesfully delete item from cart",
      cart,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "internal server error",
    });
  }
}
