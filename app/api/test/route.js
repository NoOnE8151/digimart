import getAccessToken from "@/utils/razorpay/onboard/generate access token";

export async function GET() {
    try {
        const token = await getAccessToken();
        return Response.json({ token });
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({ error: "Failed to get token" }),
            { status: 500 }
        );
    }
}
