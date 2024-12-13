"use client";
import styles from "./RegisterForm.module.css";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import { useActionState } from "react-dom";
import Swal from "sweetalert2";
import { signUpCredentials } from "@/lib/action";

const RegisterForm = () => {
  const [state, formAction] = useActionState(signUpCredentials, null);

if (state.error) {
  Swal.fire({
    title: "Error!",
    text: error.message,
    icon: "error",
    confirmButtonText: "OK",
  });
}

 

  return (
    <div className={styles.container}>
      <div className={styles.registerContainer}>
        <Image
          src="/logo.jpg" // Path to your image
          alt="Company image" // Alt text for accessibility
          width={180} // Display width
          height={101}
          className={styles.logo} // Display height
        />
        <form action={formAction}>
          <input
            type="text"
            id="userId"
            name="userId"
            placeholder="User ID"
       
          />
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
         
          />
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
          
          />
          <input
            type="confirmPassword"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="confirm Password"
            />
        
          <button type="submit">Register</button>
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
