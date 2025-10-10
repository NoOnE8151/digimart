import { NextResponse } from "next/server";
import { connectDB } from "@/connections/connectDB";
import Earnings from "@/models/user/earnings";

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
        
        const earnings = await Earnings.find();
        
        return NextResponse.json({
            success: true,
            message: "successfully fetched user's earnings",
            earnings
        })
    } catch (err) {
        console.log(err);
        return NextResponse.json({ success: false, message: "internal server error" })
    }
}