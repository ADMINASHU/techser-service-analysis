import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";


export async function POST(req) {
  const data = await req.formData();
  // console.log(data);
  const file = data.get("file");
  const id = data.get("id");
  if (!file) {
    return NextResponse.json({ message: "No image found", success: false });
  }
  const byteData = await file.arrayBuffer();
  const buffer = Buffer.from(byteData);
  const path = `./public/${id}_${file.name}`;
  await writeFile(path, buffer);
  return NextResponse.json({ message: "Image uploaded successfully", success: true });
}

export async function GET(req) {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}