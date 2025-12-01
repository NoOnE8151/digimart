// app/api/submerchants/route.js

export async function GET() {
  try {
    const key_id = process.env.RAZORPAY_PARTNER_KEY;
    const key_secret = process.env.RAZORPAY_PARTNER_SECRET;

    if (!key_id || !key_secret) {
      return Response.json(
        { error: "Missing Razorpay credentials." },
        { status: 500 }
      );
    }

    const auth = Buffer.from(`${key_id}:${key_secret}`).toString("base64");

    const res = await fetch("https://api.razorpay.com/v2/accounts", {
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
      },
      cache: "no-cache",
    });

    const data = await res.json();

    if (!res.ok) {
      return Response.json({ error: data }, { status: res.status });
    }

    return Response.json(data, { status: 200 });

  } catch (err) {
    return Response.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
