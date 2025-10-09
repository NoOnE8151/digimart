import { NextResponse } from "next/server";
import getAccessToken from "@/utils/razorpay/onboard/generate access token";

export async function POST(req) {
  const { accountId } = await req.json();
  if (!accountId) return NextResponse.json({ error: "Missing accountId" }, { status: 400 });

  const accessToken = await getAccessToken();

  const payload = {
    account_id: accountId,
    redirect_uri: `/dashboard`, // your redirect
    // optionally include state for CSRF
  };

  const res = await fetch(`https://api.razorpay.com/v2/accounts/${accountId}/kyc_links`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (data.error) {
    return NextResponse.json({ success: false, error: data.error }, { status: 400 });
  }

  return NextResponse.json({ success: true, onboardingUrl: data });
}
