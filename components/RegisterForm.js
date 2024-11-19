"use client";
import styles from "./RegisterForm.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";

const RegisterForm = () => {
  const [userID, setUserID] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("/api/register", { userID, email, password });
      if (response.status === 201) {
        setUserID("");
        setEmail("");
        setPassword("");
        router.push("/");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.registerContainer}>
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
          <p>
            Already have an account?
            <Link href="/" className={styles.loginLink}>
              Signin
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
