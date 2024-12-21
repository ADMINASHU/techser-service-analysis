import { NextResponse } from "next/server";
import User from "../../../models/User";
import connectToServiceEaseDB from "../../../lib/serviceDB";

export async function GET() {
  try {
    await connectToServiceEaseDB();
    const users = await User.find({ isAdmin: { $ne: true } }, "-password");
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
