import { NextResponse } from "next/server";
import Cart from "@/models/shop/cart";
import { connectDB } from "@/connections/connectDB";
import Product from "@/models/product";

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();

    if (!data || !data.visitorName || !data._id) {
      return NextResponse.json({ success: false, message: "Invalid request data" }, { status: 400 });
    }

    const product = await Product.findById(data._id);

    if(product.cart.includes(data.visitorName)) {
      return NextResponse.json({ success: false, message: "this product is already in cart" });
    }

    const cart = await Cart.create({
      username: data.visitorName,
      title: data.title,
      description: data.description,
      price: data.price,
      product: {
        url: data.product?.url,
        publicId: data.product?.publicId,
      },
      type: data.type,
      categories: data.categories,
      thumbnail: {
        url: data.thumbnail?.url || null,
        publicId: data.thumbnail?.publicId || null,
      },
      actualProductId: data._id,
    });

     await Product.findByIdAndUpdate(
      data._id,
      { $addToSet: { cart: data.visitorName } },
      { new: true }
    );

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Successfully added item to cart", cart },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /cart:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}