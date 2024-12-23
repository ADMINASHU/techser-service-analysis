import { NextResponse } from "next/server";
import UserData from "../../../models/UserData";
import connectToServiceEaseDB from "../../../lib/serviceDB";

export async function GET() {
  try {
    await connectToServiceEaseDB();
    const users = await UserData.find();
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
