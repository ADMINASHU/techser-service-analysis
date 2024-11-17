"use client";

import React from "react";
import styles from "./LoginForm.module.css";
import Link from "next/link";
import { doLogin } from "@/app/action";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const router = useRouter();
  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    handleLogin(formData);
  }
  const handleLogin = async (formData) => {
    try {
      const response = await doLogin(formData);
      if (!!response.error) {
        console.log(response.error);
      } else {
        router.push("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <img src="/logo.jpg" alt="Company Logo" className={styles.logo} />
      <form onSubmit={handleSubmit}>
        <input type="text" id="userId" name="userId" placeholder="User ID" required />
        <input type="password" id="password" name="password" placeholder="Password" required />
        <button type="submit">Sign in</button>
        <p>
          Don't you have an account?
          <Link href={"/register"} className={styles.signupLink}>
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
