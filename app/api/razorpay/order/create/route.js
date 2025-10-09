import { NextResponse } from "next/server";
import razorpay from "@/library/razorpay";

export async function POST(request) {
  try {
    const { amount, merchantId } = await request.json();

    console.log(amount, merchantId);

    if (!amount || amount <= 0 || !merchantId) {
      return NextResponse.json({
        success: false,
        message: "Invalid request parameters",
      });
    }

    const amountInPaise = amount * 100;
    const subMerchantAmount = Math.floor(amountInPaise * 0.9);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      transfers: [
        {
          account: merchantId,
          amount: subMerchantAmount,
          currency: "INR",
        },
      ],
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: amountInPaise,
      currency: 'INR', 
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("Razorpay error:", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
}
