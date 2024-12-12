// app/api/register/route.js
import { NextResponse } from "next/server";
import connectToServiceEaseDB from "@/lib/serviceDB";
import client from "@/lib/db";
import bcrypt from "bcryptjs";
import { User } from "../../models/User";
import { getUserByUserID } from "@/data/user";

export async function POST(request) {
  try {
    const db = await client.connect(); // Connect to the database
    if (!db) {
      return NextResponse.status(500).json({ error: "Error connecting to the database" });
    }
    const { userID, email, password } = await request.json();

    const isAdmin = false;

    if (!userID || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }
    console.log(userID);

    // Check if user already exists
    const existingUser = await getUserByUserID(userID);
 
    if (existingUser) {
      return NextResponse.json({ message: "User ID is already in use" }, { status: 400 });
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
