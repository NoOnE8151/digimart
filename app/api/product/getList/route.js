import { NextResponse } from "next/server";
import Product from "@/models/product";
import { connectDB } from "@/connections/connectDB";

export async function POST(request) {
    try {
        await connectDB();
        const { userId } = await request.json();
        const productList = await Product.find({ userId });
        if (!productList) {
            return NextResponse.json({success: false, message: "this user haven't added any product yet"})
        }
        return NextResponse.json({ success: true, message: 'successfully fetched all products for this user', productList })
    } catch(err) {
        console.log(err);
        return NextResponse.json({ success: false, message: 'internal server error' })
    }
}