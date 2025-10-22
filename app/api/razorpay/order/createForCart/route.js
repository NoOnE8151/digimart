import { NextResponse } from "next/server";
import razorpay from "@/library/razorpay";
import { currentUser } from "@clerk/nextjs/dist/types/server";

export async function POST(request) {
  try {
    const cartItems = await request.json();

    if (!cartItems) {
      return NextResponse.json({
        success: false,
        message: "Invalid request parameters",
      });
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price, 0);
    const totalAmountInPaise = totalAmount * 100;

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
      currency: "INR",
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
