import { NextResponse } from "next/server";
    import { connectDB } from "@/connections/connectDB";
    import Customer from "@/models/shop/customer";

export async function POST(request) {
    try {
        const data = await request.json();
        await connectDB();

        if(!data.username) {
            return NextResponse.json({
                success: false,
                message: 'missing field "username"'
            })
        }
        
        const customers = await Customer.findOne({ username: data.username});
        
        return NextResponse.json({
            success: true,
            message: "successfully fetched customers",
            customers
        })
    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, message: "internal server error" })
    }
}