import { NextResponse } from "next/server";
import crypto from "crypto";

// Disable body parsing so we can read raw body
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    const rawBody = await req.arrayBuffer();
    const bodyString = Buffer.from(rawBody).toString("utf-8");

    const razorpaySignature = req.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(bodyString)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(bodyString);
    const event = payload.event;

    // Handle events
    switch (event) {
      case "account.activated":
        // update DB for seller activation
        console.log("Account activated:", payload);
        break;

      case "account.needs_clarification":
        // update DB for missing KYC fields
        console.log("Account needs clarification:", payload);
        break;

      case "bank_account.verified":
        // update DB for bank verification
        console.log("Bank account verified:", payload);
        break;

      case "bank_account.verification_failed":
        // update DB for failed bank verification
        console.log("Bank account verification failed:", payload);
        break;

      case "account.kyc_verified":
      case "account.kyc_submitted":
      case "account.kyc_rejected":
        // handle KYC events
        console.log("KYC webhook received:", event);
        break;

      case "payment.captured":
        // handle payments (optional)
        console.log("payement captured webhook received");
        break;

      default:
        console.log("Unhandled event type:", event);
        break;
    }

    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
