// app/api/data/route.js
import connectToServiceEaseDB from "../../../lib/serviceDB";
import Data from "../../models/Data";
import { NextResponse } from "next/server";

export async function GET() {
  const db = await connectToServiceEaseDB();

  if (!db) {
    return NextResponse.status(500).json({ message: "Error connecting to the database" });
  }

  const data = await Data.find({});

  return NextResponse.json(data, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
