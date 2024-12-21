"use client";
import React, { useState } from "react";
import styles from "./ForgotPasswordForm.module.css";
import Swal from "sweetalert2";
import Image from "next/image";
import Link from "next/link"; // Import Link from next/link
import axios from "axios";
import { useRouter } from "next/navigation";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();
    if (!email) {
      Swal.fire({
        title: "Warning!",
        text: "Please enter your email.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    try {
      const response = await axios.post("/api/send-email", { email });

      // console.log("from from page:" + JSON.stringify(response.data));
      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: response.data.message,
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          router.push("/login");
        });
      }
    } catch (error) {
      if (error.status === 400) {
        Swal.fire({
          title: "Error!",
          text: error.response.data.error,
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to send reset email. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.forgotPasswordContainer}>
        <Image
          src="/logo.jpg" // Path to your image
          alt="Company image" // Alt text for accessibility
          priority
          width={180} // Display width
          height={101} // Display height
          className={styles.logo}
        />
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">Reset Password</button>
        </form>
        <p>
          <Link href="/login" className={styles.goBackLink}>
            Go Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
