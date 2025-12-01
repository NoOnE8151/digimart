export async function deleteFile(publicId, resourceType) {
  const res = await fetch("/api/cloudinary/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ files: [
        { publicId, resourceType }
      ]}),
  });
  const r = await res.json();
  return r;
}
