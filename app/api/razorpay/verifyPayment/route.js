import { NextResponse } from "next/server";

export async function POST(request) {
     try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await request.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const encoder = new TextEncoder();
    const keyData = encoder.encode(process.env.RAZORPAY_GATEWAY_SECRET);
    const bodyData = encoder.encode(body);

    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signatureBuffer = await crypto.subtle.sign("HMAC", key, bodyData);

    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (expectedSignature === razorpay_signature) {
      return NextResponse.json({ success: true, message: "Payment verified ✅" });
    } else {
      return NextResponse.json({ success: false, message: "Signature mismatch ❌" });
    }
  } catch (err) {
    console.error("Verification error:", err);
    return NextResponse.json({ success: false, message: "Internal Server error" });
  }
}