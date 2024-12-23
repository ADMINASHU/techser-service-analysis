"use client";

import styles from "./RegisterForm.module.css";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";
import { signUp } from "@/app/action";

const RegisterForm = () => {
  const [userID, setUserID] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = { userID, email, password, confirmPassword };
    const response = await signUp({ data });

    if (response.error) {
      Swal.fire({
        title: "Error!",
        text: response.error,
        icon: "error",
        confirmButtonText: "OK",
      });
    } else {
      Swal.fire({
        title: "Success!",
        text: response.message,
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        router.push("/login");
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.registerContainer}>
        <Image
          src="/logo.jpg" // Path to your image
          alt="Company logo" // Alt text for accessibility
          priority
          width={180} // Display width
          height={101}
          className={styles.logo} // Display height
        />
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="userID"
            name="userID"
            placeholder="User ID"
            value={userID}
            onChange={(e) => setUserID(e.target.value)}
          />
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit">Signup</button>
          <p>
            Already have an account?
            <Link href="/login" className={styles.loginLink}>
              Signin
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
