import { NextResponse } from "next/server";
import getAccessToken from "@/utils/razorpay/onboard/generate access token";
import SubMerchant from "@/models/razorpay/submerchant";
import { connectDB } from "@/connections/connectDB";

export async function POST(request) {
  const data = await request.json();
  console.log("Received data:", data);
  const accessToken = await getAccessToken();

  try {
    const payload = {
      email: "decency2217@gmail.com",
      phone: data.phone,
      type: "route",
      legal_business_name: data.businessName,
      business_type: "proprietorship",
      contact_name: data.contactName,
      profile: {
        category: "ecommerce",
        subcategory: "ecommerce_marketplace",
        addresses: {
          registered: {
            street1: data.street1,
            street2: data.street2,
            city: data.city,
            state: data.state,
            postal_code: data.postalCode,
            country: "IN",
          },
        },
      },
    };

    console.log("Payload being sent:", JSON.stringify(payload, null, 2));

    const res = await fetch(`https://api.razorpay.com/v2/accounts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const account = await res.json();
    console.log("Razorpay response:", account);

        if (account?.error) {
      return NextResponse.json(
        {
          success: false,
          message:
            account.error.description ||
            "Something went wrong, please try entering a known city's pincode to proceed.",
          error: account.error,
        },
        { status: 400 }
      );
    }

    await connectDB();
    const subMerchant = await SubMerchant.create({
      accountId: account.id,
      type: account.type,
      status: account.status,
      email: account.email,
      phone: account.phone,
      businessType: account.business_type,
      legalBusinessName: account.legal_business_name,
      customerFacingBusinessName: account.customer_facing_business_name,
      profile: {
        category: account.profile?.category,
        subcategory: account.profile?.subcategory,
        businessModel: account.profile?.business_model,
        addresses: {
          registered: {
            street1: account.profile?.addresses?.registered?.street1,
            street2: account.profile?.addresses?.registered?.street2,
            city: account.profile?.addresses?.registered?.city,
            state: account.profile?.addresses?.registered?.state,
            postalCode: account.profile?.addresses?.registered?.postal_code,
            country: account.profile?.addresses?.registered?.country || "IN",
          },
          operation: {
            street1: account.profile?.addresses?.operation?.street1,
            street2: account.profile?.addresses?.operation?.street2,
            city: account.profile?.addresses?.operation?.city,
            state: account.profile?.addresses?.operation?.state,
            postalCode: account.profile?.addresses?.operation?.postal_code,
            country: account.profile?.addresses?.operation?.country || "IN",
          },
        },
      },
      legalInfo: {
        pan: account.legal_info?.pan,
        gst: account.legal_info?.gst,
      },
      apps: {
        websites: account.apps?.websites || [],
        android: account.apps?.android || [],
        ios: account.apps?.ios || [],
      },
      brand: {
        color: account.brand?.color,
      },
      contactInfo: {
        chargeback: account.contact_info?.chargeback || {},
        refund: account.contact_info?.refund || {},
        support: account.contact_info?.support || {},
      },
      notes: {
        internalRefId: account.notes?.internal_ref_id,
      },
      createdAt: account.created_at
        ? new Date(account.created_at * 1000)
        : Date.now(),

      // Default fields for balance and KYC
      kycStatus: "pending",
      balance: 0,
      currency: "INR",
      totalPayouts: 0,
      payoutHistory: [],
    });

    return NextResponse.json({
      success: true,
      subMerchant,
      message: "Successfully Onboarded you to DigiMart.",
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create account - internal server error",
      },
      { status: 500 }
    );
  }
}
