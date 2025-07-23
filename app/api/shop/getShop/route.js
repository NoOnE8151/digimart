import { NextResponse } from "next/server";
import Shop from "@/models/shop";
import { connectDB } from "@/connections/connectDB";

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    let shopData = await Shop.findOne({ username: data.username });

    if(!shopData) {
       shopData = await Shop.create({
            username: data.username,
            name: `${data.username}'s Shop`,
            description: '',
            coverImage: {
                url: '',
                publicId: ''
            },
            image: {
                url: data.avatar,
                publicId: ''
            }
        })
    }

    return NextResponse.json({ success: true, message: "succesfully fetched shop info", shopData })
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      message: "internal server error",
    });
  }
}
