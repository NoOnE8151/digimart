import { NextResponse } from "next/server";
import razorpay from "@/library/razorpay";

export async function POST(request) {
  try {
    const { cartItems } = await request.json();

    // Validate input
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({
        success: false,
        message: "Cart must contain at least one product",
      });
    }

    let totalAmount = 0;
    const merchantTransfers = {};

    for (const item of cartItems) {
      const price = item?.product?.price;
      const merchantId = item?.product?.merchant;

      if (!price || price <= 0 || !merchantId) {
        return NextResponse.json({
          success: false,
          message: "Each product must have a valid price and merchant ID",
        });
      }

      const priceInPaise = price * 100;
      totalAmount += priceInPaise;

      if (!merchantTransfers[merchantId]) {
        merchantTransfers[merchantId] = 0;
      }

      merchantTransfers[merchantId] += priceInPaise;
    }

    if (totalAmount <= 0) {
      return NextResponse.json({
        success: false,
        message: "Invalid total amount",
      });
    }

    const transfers = Object.entries(merchantTransfers).map(
      ([merchantId, amount]) => ({
        account: merchantId,
        amount: Math.floor(amount * 0.9), 
        currency: "INR",
      })
    );

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: totalAmount,
      currency: "INR",
      transfers,
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: totalAmount,
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
