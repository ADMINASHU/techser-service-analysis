import React from "react";
import Link from "next/link";
import { auth } from "@/auth";
import Logout from "./Logout";

const Navbar = async () => {
  const session = await auth();
  const isAuthenticated = !!session?.user;

  return (
    <nav>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/login">Login</Link>
        </li>
        <li>
          <Link href="/sheets">Sheets</Link>
        </li>
        <li>
          <Link href="/data">Server Data</Link>
        </li>
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
