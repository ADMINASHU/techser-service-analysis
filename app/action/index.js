"use server";

import bcrypt from "bcryptjs";
import prisma from "@/lib/prismaClient";
import { SignInSchema, RegisterSchema } from "@/lib/zod";
import { CredentialsSignin } from "next-auth";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export async function doLogout() {
  await signOut({ redirect: true, redirectTo: "/login" });
}

export async function doLogin({ userID, password }) {
  try {
    const result = SignInSchema.safeParse({
      userID,
      password,
    });

    if (!result.success) {
      return { error: result.error.errors[0].message };
    }

    await signIn("credentials", {
      ...result.data,
      redirect: true,
    });

    return { success: true, message: "Signin successful" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
}

export const signUp = async ({ data }) => {
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
    const { userID, email, password } = result.data;

    const existingUserID = await prisma.users.findUnique({ where: { userID } });
    const existingUserEmail = await prisma.users.findUnique({ where: { email } });
    if (existingUserID || existingUserEmail) {
      return { error: "User already exists" };
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = await prisma.users.create({
      data: {
        userID,
        email,
        password: hashedPassword,
        isAdmin: false,
      },
    });

    return { message: "User registered successfully" };
  } catch (error) {
    return { error: error.message };
  }
};

export const signInCredentials = async ({ userID, password }) => {
  try {
    const user = await prisma.users.findUnique({ where: { userID } });

    if (user) {
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return null;
      }
      return user;
    }
    return null;
  } catch (error) {
    return { error: error.message };
  }
};
