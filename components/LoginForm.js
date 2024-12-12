"use client";
import React, { startTransition } from "react";
import { useState } from "react";
import styles from "./LoginForm.module.css";
import Link from "next/link";
import { doLogin } from "@/app/action";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Image from "next/image";
const LoginForm = () => {
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();

    const cred = { userID, password };
    startTransition(() => {
      doLogin(cred).then((data) => {
        if (data.error) {
          Swal.fire({
            title: "Warning!",
            text: data.error,
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
        if (data.success) {
          Swal.fire({
            title: "Warning!",
            text: data.success,
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
      });
    });
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginContainer}>
        <Image
          src="/logo.jpg" // Path to your image
          alt="Company image" // Alt text for accessibility
          width={180} // Display width
          height={101}
          className={styles.logo} // Display height
        />
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
            Don&apos;t you have an account?
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
