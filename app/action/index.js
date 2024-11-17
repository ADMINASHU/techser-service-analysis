"use server";

import { signIn, signOut } from "@/auth";

export async function doLogout() {
  await signOut({ redirect: "/" });
}

export async function doLogin(formData) {
  try {
    const response = await signIn("credentials", {
      userID: formData.get("userId"),
      password: formData.get("password"),
      redirect: false,
    });
    return response;
  } catch (error) {
    throw new Error(error);
  }
}
