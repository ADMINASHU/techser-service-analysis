"use server";

import { signIn, signOut } from "@/auth";

export async function doLogout() {
  await signOut({ redirect: "/" });
}

export async function doLogin(cred) {
  const { userID, password } = cred; // No need to use await here
  try {
    const response = await signIn("credentials", {
      userID,
      password,
      redirect: false,
    });

    if (response.error) {
      console.error("Authentication error:", response.error);
      throw new Error('Sign in failed');
    } else {
      console.log("Login successful:", response);
    }
    return response;
  } catch (error) {
    return { error: "An unexpected error occurred. Please try again." };
  }
}
