import { connectDB } from "@/connections/connectDB";
import { NextResponse } from "next/server";
import Library from "@/models/library";

export async function POST(request) {
    try {
        const { username } = await request.json();
        await connectDB();

        const libItems = await Library.find({ username });
        
        return NextResponse.json({ success: true, message: "successfully fetched library", library: libItems})

    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: 'internal server error'});
    }
}