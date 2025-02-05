import connectToServiceEaseDB from "../../../lib/serviceDB";
import CPData from "../../../models/CPData";
import { NextResponse } from "next/server";
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const startRow = parseInt(searchParams.get("startRow")) || 0;
  const chunkSize = parseInt(searchParams.get("chunkSize")) || 400;

  try {
    const db = await connectToServiceEaseDB();

    if (!db) {
      return NextResponse.status(500).json({ message: "Error connecting to the database" });
    }

    const totalRows = await CPData.countDocuments({ callIds: { $ne: [] } });
    const finalData = await CPData.find({ callIds: { $ne: [] } })
      .skip(parseInt(startRow))
      .limit(parseInt(chunkSize));

    return NextResponse.json(
      { finalData, totalRows },
      {
        status: 200,
        headers: {
          "Content-Type": "application/x-javascript; charset=utf-8",
          "Cache-Control": "max-age=300",
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
