import { NextResponse } from "next/server";
import { connectDB } from "@/connections/connectDB";
import Shop from "@/models/shop";

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();

    // Build update object dynamically, only including defined fields
    const updateFields = {};
    
    if (data.name !== undefined) updateFields.name = data.name;
    if (data.description !== undefined) updateFields.description = data.description;
    
    // Handle nested objects - use dot notation OR full object, not both
    if (data.coverImage) {
      // Option 1: Update individual properties with dot notation
      if (data.coverImage.url !== undefined) {
        updateFields['coverImage.url'] = data.coverImage.url;
      }
      if (data.coverImage.publicId !== undefined) {
        updateFields['coverImage.publicId'] = data.coverImage.publicId;
      }
    }
    
    if (data.image) {
      // Option 1: Update individual properties with dot notation
      if (data.image.url !== undefined) {
        updateFields['image.url'] = data.image.url;
      }
      if (data.image.publicId !== undefined) {
        updateFields['image.publicId'] = data.image.publicId;
      }
    }

    const updatedShop = await Shop.findOneAndUpdate(
      { username: data.username },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedShop) {
      return NextResponse.json({
        success: false,
        status: 404,
        message: "Shop not found"
      });
    }

    return NextResponse.json({ 
      success: true, 
      status: 200, 
      updatedShop 
    });

  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      status: 500,
      message: "internal server error",
    });
  }
}