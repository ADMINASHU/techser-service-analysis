"use server";

import bcrypt from "bcryptjs";
import connectToServiceEaseDB from "@/lib/serviceDB";
import { User } from "../models/User";
import { RegisterSchema } from "@/lib/zod";
import { CredentialsSignin } from "next-auth";

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
      return { error: result.error.errors[0].message };
    } else {
      return { error: "Please provide a valid credentials" };
    }
  }

  try {
    const db = await connectToServiceEaseDB();
    if (!db) {
      return { error: "Error connecting to the database" };
    }

    const { userID, password } = result.data;

    // Check if user already exists
    const user = await User.findOne({ userID });

    if (user) {
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!user || !isValidPassword) {
        return { error: "Invalid credentials" };
      }
      return user;
    }
    return null;
  } catch (error) {
    return { error: error.message };
  }
};
