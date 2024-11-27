import { NextResponse } from "next/server";
import { User } from "../../models/User";
import connectToServiceEaseDB from "../../../lib/serviceDB";

export async function PUT(request) {
  const { userID, name, image, designation, region, branch, mobileNo, email, level } =
    await request.json();

  try {
    await connectToServiceEaseDB();

    const user = await User.findOneAndUpdate(
      { userID },
      {
        $set: {
          name,
          image,
          designation,
          region,
          branch,
          mobileNo,
          email,
          level,
          verified: false, // Reset verified to false on edit
        },
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
export async function POST(request) {
  try {
  const { userID } = await request.json();
  console.log("From profile/ post : "+userID);
    await connectToServiceEaseDB();
    const user = await User.findOne({ userID });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
