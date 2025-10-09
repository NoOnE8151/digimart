import { connectDB } from "@/connections/connectDB";
import Library from "@/models/library";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { product } = await request.json();
        await connectDB();

        const productToAdd = await Library.create({
                username: product.username,
                title: product.title,
                description: product.description,
                price: product.price,
                thumbnail: {
                    url: product.thumbnail.url,
                    publicId: product.thumbnail.publicId
                },
                type: product.type,
                product: {
                    url: product.product.url,
                    publicId: product.product.publicId
                },      
        })

        return NextResponse.json({
            success: true, message: "successfully added purchased item to library", product: productToAdd
        })

    } catch(error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "internal server error" })
    }
}