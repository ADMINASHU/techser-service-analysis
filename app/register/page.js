import React from "react";
import RegisterForm from "@/components/RegisterForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
const RegisterPage = async () => {
  const session = await auth();
  const isAuthenticated = !!session?.user;
  if (isAuthenticated) {
    redirect("/profile");
  }
  return <RegisterForm />;
};

export default RegisterPage;
