import { NextResponse } from "next/server";
import Product from "@/models/product";
import { connectDB } from "@/connections/connectDB";

export async function POST(request) {
    try {
        await connectDB();
        const { productId } = await request.json();
        const product = await Product.findById(productId)
        if (!product) {
            return NextResponse.json({success: false, message: "product with this is not found"})
        }
        return NextResponse.json({ success: true, message: 'successfully fetched product', product })
    } catch(err) {
        console.log(err);
        return NextResponse.json({ success: false, message: 'internal server error' })
    }
}