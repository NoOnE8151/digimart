import { connectDB } from "@/connections/connectDB";
import Library from "@/models/library";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { products } = await request.json(); // expect "products" key
        await connectDB();

        let productsToAdd;

        if (Array.isArray(products)) {
            // Multiple products
            productsToAdd = await Library.insertMany(
                products.map(product => ({
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
                }))
            );
        } else {
            // Single product
            productsToAdd = await Library.create({
                username: products.username,
                title: products.title,
                description: products.description,
                price: products.price,
                thumbnail: {
                    url: products.thumbnail.url,
                    publicId: products.thumbnail.publicId
                },
                type: products.type,
                product: {
                    url: products.product.url,
                    publicId: products.product.publicId
                },
            });
        }

        return NextResponse.json({
            success: true,
            message: "Successfully added product(s) to library",
            product: productsToAdd
        });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "Internal server error" });
    }
}
