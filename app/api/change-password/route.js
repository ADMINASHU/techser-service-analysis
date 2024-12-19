import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs'; // Import bcrypt for password hashing
import User  from "../../../models/User";
import connectToServiceEaseDB from "../../../lib/serviceDB";

export async function POST(request) {
  const { userID, currentPassword, newPassword } = await request.json();

  try {
    await connectToServiceEaseDB();

    // Find the user by userID
    const user = await User.findOne({ userID });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Check if the current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Current password is incorrect" }, { status: 401 });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedNewPassword;
    await user.save();

    return NextResponse.json({ message: "Password reset successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
