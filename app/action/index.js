"use server";

import bcrypt from "bcryptjs";
import connectToServiceEaseDB from "@/lib/serviceDB";
import { User } from "../models/User";
import { RegisterSchema } from "@/lib/zod";
import NextAuth, { CredentialsSignin } from "next-auth";

export const signUp = async ({ data }) => {
  // Validate data using Zod schema
  const result = RegisterSchema.safeParse({
    userID: data.userID,
    email: data.email,
    password: data.password,
    confirmPassword: data.confirmPassword,
  });

  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  try {
    const db = await connectToServiceEaseDB();
    if (!db) {
      return { error: "Error connecting to the database" };
    }

    const { userID, email, password } = result.data;

    // Check if user already exists
    const existingUserID = await User.findOne({ userID });
    const existingUserEmail = await User.findOne({ email });
    if (existingUserID || existingUserEmail) {
      return { error: "User already exists" };
    }

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Create a new user
    const newUser = new User({
      userID,
      email,
      password: hashedPassword,
      isAdmin: false, // Ensure isAdmin is defined if it's necessary
    });

    await newUser.save();
    return { message: "User registered successfully" };
  } catch (error) {
    return { error: error.message };
  }
};
export const signIn = async ({ data }) => {
  // Validate data using Zod schema

  const result = SignInSchema.safeParse({
    userID: data.userID,
    password: data.password,
  });

  if (!result.success) {
    if (result.error) {
      throw new CredentialsSignin(result.error.errors[0].message);
    } else {
      throw new CredentialsSignin("Please provide a valid credentials");
    }
  }

  try {
    const db = await connectToServiceEaseDB();
    if (!db) {
      return { error: "Error connecting to the database" };
    }

    const { userID, password } = result.data;

    // Check if user already exists
    const existingUserID = await User.findOne({ userID });

    if (!existingUserID) {
      return { error: "User not found" };
    }

  

    // Create a new user
    const newUser = new User({
      userID,
      email,
      password: hashedPassword,
      isAdmin: false, // Ensure isAdmin is defined if it's necessary
    });

    await newUser.save();
    return { message: "User registered successfully" };
  } catch (error) {
    return { error: error.message };
  }
};
