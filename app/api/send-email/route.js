import { NextResponse } from "next/server";
import nodemailer from "nodemailer"; // For sending emails
import User from "../../../models/User";
import connectToServiceEaseDB from "../../../lib/serviceDB";

export async function POST(request) {
  try {
    await connectToServiceEaseDB();
    const { email } = await request.json();
    // console.log(email);

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 });
    }
    // console.log(user);
    const resetToken = Math.random().toString(36).substring(2);

    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save();
    // console.log(user);
    const userName = user.fName || user.userID;
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_ID,
      to: email,
      subject: "Password Reset for Techser Service Analysis App",
      html: `
      <html>
      <head>
        <style>
          .email-container {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f9f9f9;
            padding: 20px;
          }
          .email-header {
            text-align: center;
            background-color: #333;
            color: #fff;
            padding: 10px;
          }
          .email-content {
            margin: 20px;
          }
          .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: #fff;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 0;
            text-align: center;
          }
          .button:hover {
            background-color: #0056b3;
          }
          .footer {
            text-align: left;
            margin: 20px;
            font-size: 12px;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>Techser Service Analysis App</h1>
          </div>
          <div class="email-content">
            <p>Dear ${userName},</p>
            <p>You requested a password reset. Please click on the button below to reset your password:</p>
            <p>
              <a href="${process.env.BASE_URL}/reset-password?token=${resetToken}" class="button">Reset Password</a>
            </p>
            <p>This link will expire in 30 minutes.</p>
            <p>If you did not request this password reset, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>Thank you,</p>
            <p>Techser Service Analysis Team</p>
          </div>
        </div>
      </body>
      </html>
      `,
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

export async function GET(request) {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}
