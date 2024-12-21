"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import axios from "axios";
import styles from "./ResetPasswordForm.module.css";
import Image from "next/image";
import Swal from "sweetalert2";

const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token"); // Retrieve the token from the URL query

  useEffect(() => {
    if (!token) {
      Swal.fire({
        title: "Error!",
        text: "Invalid or missing token",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!password || !confirmPassword) {
      Swal.fire({
        title: "Warning!",
        text: "Please enter your password.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    if (password !== confirmPassword) {
      Swal.fire({
        title: "Error!",
        text: "Passwords do not match",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const response = await axios.post("/api/reset-password", { token, password });
      if (response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Password reset successfully! You can now login with your new password.",
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
          text: "Failed to reset password",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.resetPasswordContainer}>
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
            type="password"
            id="password"
            name="password"
            placeholder="New Password"
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
          <button type="submit">Save Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
