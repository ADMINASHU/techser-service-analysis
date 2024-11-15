
import { redirect } from "next/navigation"
import { AuthError } from "next-auth"
// import { useState } from "react";
import { signIn } from "@/auth.js";
import styles from "./LoginForm.module.css";
import Link from "next/link";

export default async function SignInPage(props) {
  
  // const [userID, setUserID] = useState("");
  // const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("user-id", e.target.value);
    formData.append("password", e.target.value);
  };

  return (
    <div className={styles.loginContainer}>
      <img src="/logo.jpg" alt="Company Logo" className={styles.logo} />
      <form
        // onSubmit={handleSubmit}
        action={async (formData) => {
          "use server";
          try {
            await signIn("credentials", formData);
          } catch (error) {
            if (error instanceof AuthError) {
              return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`);
            }
            throw error;
          }
        }}
      >
        <input
          type="text"
          id="user-id"
          name="user-id"
          placeholder="User ID"
          
          // onChange={handleSubmit}
          required
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
      
          // onChange={handleSubmit}
          required
        />
        <button type="submit">Sign in</button>
        <Link href={"/register"} className={styles.signupLink}>
          Sign up
        </Link>
      </form>
      {/* {Object.values(providerMap).map((provider) => (
        <form
          action={async () => {
            "use server"
            try {
              await signIn(provider.id, {
                redirectTo: props.searchParams?.callbackUrl ?? "",
              })
            } catch (error) {
              // Signin can fail for a number of reasons, such as the user
              // not existing, or the user not having the correct role.
              // In some cases, you may want to redirect to a custom error
              if (error instanceof AuthError) {
                return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`)
              }
 
              // Otherwise if a redirects happens Next.js can handle it
              // so you can just re-thrown the error and let Next.js handle it.
              // Docs:
              // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
              throw error
            }
          }}
        >
          <button type="submit">
            <span>Sign in with {provider.name}</span>
          </button>
        </form>
      ))} */}
    </div>
  );
};


