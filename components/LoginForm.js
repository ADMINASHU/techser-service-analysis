"use client";
import { useState } from "react";
import React from "react";
import styles from "./LoginForm.module.css";
import Link from "next/link";
import { doLogin } from "@/app/action";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();
    if (!userID || !password) {
      Swal.fire({
        title: "Warning!",
        text: "Please fill in all the fields.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    const cred = { userID, password };
    try {
      const response = await doLogin(cred);
      if (!!response.error) {
        console.log(response.error);
      } else {
        router.push("/home");
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: "Login failed. Please check your credentials.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }

  return (
    <div className={styles.container}>
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
            
          />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            
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
    </div>
  );
};

export default LoginForm;
