import { NextResponse } from "next/server";
import Product from "@/models/product";
import { connectDB } from "@/connections/connectDB";

export async function POST(request) {
    try {
        await connectDB();
        const data = await request.json();
        console.log('recived data', data)

        const product = await Product.create({
            username: data.username,
            title: data.title,
            description: data.description,
            price: data.price,
            product: {
                url: data.product.url,
                publicId: data.product.publicId
            },
            type: data.type,
            categories: data.categories,
            thumbnail: {
                url: data.thumbnail.url || null,
                publicId: data.thumbnail.publicId || null
            }
        })

        return NextResponse.json({ success:  true, message: 'successfully added new product', product })

    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, message: 'internal server error' });
    } 
}