import { NextResponse } from "next/server";
import nodemailer from "nodemailer"; // For sending emails
import { User } from "../../models/User";
import connectToServiceEaseDB from "../../../lib/serviceDB";

export async function POST(request) {
  try {
    const email = await request.json();

    console.log("from forgot routes email : " + email);
    await connectToServiceEaseDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Create a reset token (in a real app, you should use a more secure way to generate tokens)
    const resetToken = Math.random().toString(36).substring(2);

    // Update the user with the reset token and expiration time
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send the email with the reset token
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Gmail's SMTP server
      port: 587, // Port for TLS
      secure: false, // Use true for SSL
      auth: {
        user: process.env.EMAIL_ID, // Your Gmail address
        pass: process.env.EMAIL_PASS, // Your App Password or regular password
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_ID,
      to: email,
      subject: "Password Reset for Techser Service Analysis App",
      text: `You requested a password reset. Click on this link to reset your password: ${process.env.BASE_URL}/reset-password?token=${resetToken}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Password reset email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
