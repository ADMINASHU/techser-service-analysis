"use client";
import React, { useState } from "react";
import styles from "./ForgotPasswordForm.module.css";
import Swal from "sweetalert2";
import Image from "next/image";
import Link from "next/link"; // Import Link from next/link

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");

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
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(email) ,
      });

      // console.log("from from page:" + response);
      if (response.error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to send reset email. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Success!",
          text: "Password reset email sent successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      // console.log(error);
      Swal.fire({
        title: "Error!",
        text: "Failed to send reset email. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.forgotPasswordContainer}>
        <Image
          src="/logo.jpg" // Path to your image
          alt="Company image" // Alt text for accessibility
          priority={true}
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
