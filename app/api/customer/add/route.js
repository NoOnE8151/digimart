import { NextResponse } from "next/server";
import { connectDB } from "@/connections/connectDB";
import Customer from "@/models/shop/customer";

export async function POST(request) {
  try {
    const data = await request.json();
    await connectDB();

    if (!data.buyer || !data.merchant) {
      return NextResponse.json({
        success: false,
        message: 'missing fields, make sure to pass "merchant" and "buyer"',
      });
    }

    // this will create the document if it doesn't exist, or add to array without duplicates
    const updatedCustomer = await Customer.findOneAndUpdate(
      { username: data.merchant },        
      { $addToSet: { customerName: data.buyer } }, 
      { upsert: true, new: true }         
    );

    return NextResponse.json({
      success: true,
      message: "successfully stored customer to database",
      updatedCustomer,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ success: false, message: "internal server error" });
  }
}
