import { NextResponse } from "next/server";
import Product from "@/models/product";
import { connectDB } from "@/connections/connectDB";

export async function POST(request) {
    try {
        await connectDB();
        const data = await request.json();
        console.log('received data for edit', data);

        const updatedProduct = await Product.findByIdAndUpdate(
            data.productId,
            {
                userId: data.userId,
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
            },
            { new: true }
        );

        if (!updatedProduct) {
            return NextResponse.json({ success: false, message: 'Product not found' });
        }

        return NextResponse.json({ success: true, message: 'Successfully updated product', product: updatedProduct });

    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, message: 'Internal server error' });
    }
}