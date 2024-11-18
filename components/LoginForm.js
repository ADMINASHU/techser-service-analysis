"use client";
import { useState } from "react";
import React from "react";
import styles from "./LoginForm.module.css";
import Link from "next/link";
import { doLogin } from "@/app/action";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();
  
    try {
      const response = await doLogin({ userID, password });
      if (!!response.error) {
        console.log(response.error);
      } else {
        router.push("/data");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={styles.loginContainer}>
      <img src="/logo.jpg" alt="Company Logo" className={styles.logo} />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="userId"
          name="userId"
          placeholder="User ID"
          value={userID}
          onChange={(e) => setUserID(e.target.value)}
          required
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
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
