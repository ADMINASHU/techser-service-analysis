import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // For password hashing
import  User  from "../../../models/User";
import connectToServiceEaseDB from "../../../lib/serviceDB";

export async function POST(request) {
  // console.log("running: ##########################################"+ request);
  try {
    const { token, password } = await request.json(); // Destructure token and password

    // console.log("Reset token:", token);
    // console.log("New password:", password);

    await connectToServiceEaseDB();

    const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }
    // console.log("from reset api user" + user);
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password and remove the reset token and expiry time
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    return NextResponse.json({ message: "Password reset successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
