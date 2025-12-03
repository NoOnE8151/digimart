import getAccessToken from "@/utils/razorpay/onboard/generate access token";

export async function DELETE() {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(
      "https://api.razorpay.com/v2/accounts/acc_Rb8TqItxXCgM9d",
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();

    return new Response(JSON.stringify(data), { status: response.status });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
