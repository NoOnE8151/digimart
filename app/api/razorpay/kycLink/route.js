import { NextResponse } from "next/server";

export async function POST(request) {
  const { account_id } = await request.json();

  if (!account_id)
    return NextResponse.json({ success: false, message: "account_id missing" }, { status: 400 });

  const authHeader =
    "Basic " +
    Buffer.from(`${process.env.RAZORPAY_PARTNER_KEY}:${process.env.RAZORPAY_PARTNER_SECRET}`).toString("base64");

  try {
    const response = await fetch(
      `https://api.razorpay.com/v2/accounts/${account_id}/kyc_links`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({
          reference_id: `kyc_${account_id}_${Date.now()}`,
          kyc_purpose: "business",
          notify: true,
          notes: {
            info: "Complete your KYC to start receiving settlements",
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Razorpay KYC link error:", err);
      return NextResponse.json(
        { success: false, message: "Failed to create KYC link", error: err },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, url: data.short_url });
  } catch (error) {
    console.error("KYC link exception:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
