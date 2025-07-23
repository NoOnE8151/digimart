import ShopPublicView from "@/components/shop/visitorView";
import { clerkClient } from '@clerk/nextjs/server'
import Shop from "@/models/shop";
import { notFound } from "next/navigation";
import { connectDB } from "@/connections/connectDB";

export default async function ShopLayout({ children, params }) {
  try {
    await connectDB();
    const { user } = await params;
    const username = user;
    
    const shopData = await Shop.findOne({ username });

    if (!shopData) {
      notFound(); 
    }

    //convert mongoose document to plain object
    const shop = JSON.parse(JSON.stringify(shopData.toObject({
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    })));

    return <ShopPublicView shop={shop}>{children}</ShopPublicView>;
    
  } catch (error) {
    // Check if it's a Next.js notFound error - let it bubble up
    if (error?.digest?.includes('NEXT_HTTP_ERROR_FALLBACK')) {
      throw error;
    }
    
    // Handle other errors
    console.error('ShopLayout error:', error);
    return <div>Internal server error</div>;
  }
}