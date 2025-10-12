import { NextResponse } from "next/server";
import { connectDB } from "@/connections/connectDB";
import Product from "@/models/product";

export async function POST(request) {
  try {
    const { searchInput } = await request.json();
    await connectDB();

    const productList = await Product.find();

    const searchWords = searchInput.toLowerCase().split(" ");
    
    const partialMatch = productList.filter((product) => {
      const title = product.title.toLowerCase();
      return searchWords.some((word) => title.includes(word));
    });

    return NextResponse.json({
      success: true,
      message: "successfully fetched matching products from search query",
      products: partialMatch,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      success: false,
      message: "internal server error",
    });
  }
}
