import { NextResponse } from "next/server";
import SubMerchant from "@/models/razorpay/submerchant";
import { connectDB } from "@/connections/connectDB";

export async function POST(request) {
  try {
    const data = await request.json();
    await connectDB();
    const subMerchant = await SubMerchant.findOne({username: data.username}); 

    return NextResponse.json({
      success: true,
      subMerchant,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch sub-merchants",
    });
  }
}
