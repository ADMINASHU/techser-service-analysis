"use client";
import styles from "./RegisterForm.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

const RegisterForm = () => {
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData(event.currentTarget);
      const userID = formData.get("userId");
      const email = formData.get("email");
      const password = formData.get("password");
      const response = await axios.post("/api/register", { userID, email, password });
      response.status === 201 && router.push("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <img src="/logo.jpg" alt="Company Logo" className={styles.logo} />
      <form onSubmit={handleSubmit}>
        <input type="text" id="userId" name="userId" placeholder="User ID" required />
        <input type="email" id="email" name="email" placeholder="Email" required />
        <input type="password" id="password" name="password" placeholder="Password" required />
        <button type="submit">Signup</button>
        <p>
          Already have an account?
          <Link href="/" className={styles.loginLink}>
            Signin
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
