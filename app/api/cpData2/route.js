import connectToServiceEaseDB from "../../../lib/serviceDB";
import CPData from "../../../models/CPData";
import { NextResponse } from "next/server";
export async function GET(request) {

  try {
    const db = await connectToServiceEaseDB();

    if (!db) {
      return NextResponse.status(500).json({ message: "Error connecting to the database" });
    }

    const totalRows = await CPData.countDocuments({ callIds: { $ne: [] } });
    const finalData = await CPData.find({ callIds: { $ne: [] } });

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
