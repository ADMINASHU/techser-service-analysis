"use client";

import { useState } from "react";
import styles from "./RegisterForm.module.css";
import Link from "next/link";
// import { useRouter } from "next/router";

const RegisterForm = () => {
  // const router = useRouter();
  const [userID, setUserID] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { userID, email, password };
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await response.json();

    if (data.error) {
      alert(data.error);
    } else {
      alert(data.message); 
      setUserID("");
      setEmail("");
      setPassword("");
      // router.push("/login");
    }
  };

  return (
    <div className={styles.registerContainer}>
      <img src="/logo.jpg" alt="Company Logo" className={styles.logo} />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="user-id"
          name="user-id"
          placeholder="User ID"
          value={userID}
          onChange={(e) => setUserID(e.target.value)}
          required
        />
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <button type="submit">Signup</button>
        <Link href="/login" className={styles.loginLink}>
          Log in
        </Link>
      </form>
    </div>
  );
};

export default RegisterForm;
