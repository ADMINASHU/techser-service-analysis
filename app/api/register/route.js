// app/api/register/route.js
import { NextResponse } from "next/server";
import connectToServiceEaseDB from "@/lib/serviceDB";
import bcrypt from "bcryptjs";
import  User  from "../../../models/User";

export async function POST(request) {
  try {
    const db = await connectToServiceEaseDB();
    if (!db) {
      return NextResponse.status(500).json({ error: "Error connecting to the database" });
    }
    const data = await request.json();
    // console.log("from server register" +JSON.stringify(data));
    const { userID, email, password } = data;
    const isAdmin = false;

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
      isAdmin,
    
    });

    await newUser.save();
    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
