import { NextResponse } from "next/server";
import Year from "../../../models/Year";
import connectToServiceEaseDB from "../../../lib/serviceDB";

export async function GET() {
  try {
    const db = await connectToServiceEaseDB();
    if (!db) {
      return NextResponse.json({ message: "Error connecting to the database" }, { status: 500 });
    }

    const yearData = await Year.find({});

    return NextResponse.json(yearData, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  const { year, selectYears } = await request.json();
  
  await Year.deleteMany({});

  try {
    await connectToServiceEaseDB();

    await Year.insertMany({ year, selectYears });

    return NextResponse.json({ message: "Data updated successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
