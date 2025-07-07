import { NextResponse } from "next/server";
import cloudinary from "@/library/cloudinary";

export async function POST(req) {
  try {
    const body = await req.json();
    const files = body.files;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json({ error: 'Missing or invalid files array' }, { status: 400 });
    }

    const results = [];

    for (const file of files) {
      const { publicId, resourceType } = file;

      if (!publicId) {
        results.push({ publicId: null, success: false, message: 'Missing publicId' });
        continue;
      }

      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });

      if (result.result === 'ok') {
        results.push({ publicId, success: true });
      } else if (result.result === 'not found') {
        results.push({ publicId, success: false, message: 'File not found' });
      } else {
        results.push({ publicId, success: false, message: result.result });
      }
    }

    return NextResponse.json({ results });

  } catch (err) {
    console.error('Cloudinary delete error:', err);
    return NextResponse.json({ error: 'Failed to delete files' }, { status: 500 });
  }
}
