import LoginForm from "@/components/LoginForm";
import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const LoginPage = async () => {
  const session = await auth();
  const isAuthenticated = !!session?.user;
  if (isAuthenticated) {
    redirect("/");
  }
  return <LoginForm />;
};

export default LoginPage;
