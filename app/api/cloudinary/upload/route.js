import { NextResponse } from "next/server";
import cloudinary from "@/library/cloudinary";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const folder = formData.get('folder');
    const type = formData.get('type');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate public ID with extension for raw files
    let uploadOptions = { resource_type: type };
    
    if (folder) {
      uploadOptions.folder = folder;
    }
    
    // For raw files, include the file extension in public_id
    if (type === 'raw') {
      const fileName = file.name;
      const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
      const baseName = fileName.substring(0, fileName.lastIndexOf('.'));
      uploadOptions.public_id = baseName + fileExtension;
    }

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(uploadOptions, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        })
        .end(buffer);
    });

    return NextResponse.json({ success: true, data: uploadResult });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}