"use server";
import { RegisterSchema } from "@/lib/zod";
import { hashSync } from "bcryptjs";
import { User } from "@/app/models/User";
import client from "./db";
import { redirect } from "next/navigation";

export const signUpCredentials = async (formData) => {
  const validateFields = RegisterSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validateFields.success) {
    return {
      error: validateFields.error.flatten().fieldErrors,
    };
  }

  const { userID, email, password } = validateFields.data;
  const hashedPassword = hashSync(password, 10);
  try {
    client.connect();


    // Create a new user
    const newUser = new User({
      userID,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    client.close();
    // return { message: "User registered successfully" };
  } catch (error) {
    return { message: "Failed to register user" };
  }
  redirect("/login");
};
