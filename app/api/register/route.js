// app/api/register/route.js
import { NextResponse } from "next/server";
import  connectMyDB  from "@/lib/myDB";
import bcrypt from "bcryptjs";
import User from "../../models/User";

export async function POST(request) {
  try {
    await connectMyDB();

    const data = await request.json();
    const { userID, email, password } = data;

    console.log(userID);

    if (!userID || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ userID });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create a new user
    const newUser = new User({
      userID,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
