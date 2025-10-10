import { NextResponse } from "next/server";
import { connectDB } from "@/connections/connectDB";
import Earnings from "@/models/user/earnings";

export async function POST(request) {
  try {
    const data = await request.json();
    console.log("data recived", data);
    await connectDB();

    if (!data.earnings || !data.merchant) {
      return NextResponse.json({
        success: false,
        message: 'missing fields, make sure to pass "username" and "earning"',
      });
    }

    const today = new Date().toISOString().split("T")[0];

    let docs = await Earnings.find({ username: data.merchant });
    console.log("fetched earnings documents of this user", docs);

    let matchFound = false; //this is to check if one of existing document matches todays date

    for (let doc of docs) {
      if (doc.earnings.date === today) {
        doc.earnings.earnings += data.earnings;
        await doc.save();
        matchFound = true;
        break;
      }
    }

    if(!matchFound) {
              Earnings.create({
        username: data.merchant,
        earnings: {
          date: today,
          earnings: data.earnings,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "successfully stored user's earnings",
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      success: false,
      message: "internal server error",
    });
  }
}
