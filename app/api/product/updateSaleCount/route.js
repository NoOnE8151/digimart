import { NextResponse } from "next/server";
import { connectDB } from "@/connections/connectDB";
import Product from "@/models/product";

export async function POST(request) {
  try {
    const data = await request.json();
    await connectDB();

    // Case 1: Single product
    if (!data.products) {
      console.log('single product recived', data);
      const product = await Product.findById(data.productId);
      if (!product) {
        return NextResponse.json({
          success: false,
          message: "Product not found",
        });
      }

      product.sales = (product.sales || 0) + data.quantity;
      await product.save();

      return NextResponse.json({
        success: true,
        message: "Successfully updated sale count for this product",
        updatedProduct: product,
      });
    }

    // Case 2: Multiple products
    console.log('multiple products recived', data);
    for (const item of data.products) {
      const productToUpdate = await Product.findById(item.productId);
      if (!productToUpdate) {
        return NextResponse.json({
          success: false,
          message: `Product with id ${item.productId} not found`,
        });
      }

      productToUpdate.sales = (productToUpdate.sales || 0) + item.quantity;
      await productToUpdate.save();
      console.log('items sell count updated');
    }

    return NextResponse.json({
      success: true,
      message: "Successfully updated sale count for all products",
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
