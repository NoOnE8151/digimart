// utils/getAccessToken.js
export async function getAccessToken() {
    try {
        const res = await fetch("https://auth.razorpay.com/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                grant_type: "client_credentials",
                mode: "live", 
                client_id: process.env.RAZORPAY_PARTNER_KEY,
                client_secret: process.env.RAZORPAY_PARTNER_SECRET
            })
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error("Token request failed:", {
                status: res.status,
                statusText: res.statusText,
                error: errorData
            });
            throw new Error(`HTTP error! status: ${res.status} - ${res.statusText}`);
        }

        const data = await res.json();
        console.log("Access token generated successfully");
        return data.access_token;
    } catch (error) {
        console.error("Error generating access token:", error);
        throw error;
    }
}

export default getAccessToken;