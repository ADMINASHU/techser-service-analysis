import React from "react";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const ForgotPasswordPage = async () => {
  const session = await auth();
  const isAuthenticated = !!session?.user;
  if (isAuthenticated) {
    redirect("/");
  }
  return <ForgotPasswordForm />;
};

export default ForgotPasswordPage;
