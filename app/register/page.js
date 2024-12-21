import RegisterForm from "@/components/RegisterForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
const RegisterPage = async () => {
  const session = await auth();
  const isAuthenticated = !!session?.user;
  if (isAuthenticated) {
    redirect("/");
  }

  return <RegisterForm />;
};

export default RegisterPage;
