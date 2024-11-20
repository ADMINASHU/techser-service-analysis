"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Logout from "./Logout";
import { useRouter } from "next/navigation";
import styles from "./Navbar.module.css"; // Import CSS module

export default function Navbar({ session }) {
  const isAuthenticated = !!session?.user;
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const profileName = session?.user?.email || "User"; // Replace with actual logic to get profile name


useEffect(() => {
  
  console.log("path:");
  console.log(router);

 
}, [router.pathname])


  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  if (isAuthenticated) {
    return (
      <nav className={styles.navbar}>
        <div className={styles.navLinks}>
          <Link href="/" className={router.pathname === "/" ? styles.activeLink : ""}>
            Home
          </Link>
          <Link href="/data" className={router.pathname === "/data" ? styles.activeLink : ""}>
            Data
          </Link>
          <Link href="/control" className={router.pathname === "/control" ? styles.activeLink : ""}>
            Control
          </Link>
        </div>
        <div className={styles.profileSection}>
          <Link href="/profile" className={styles.profileName}>
            {profileName}
          </Link>

          <Logout />
        </div>
        <button className={styles.menuButton} onClick={toggleMenu}>
          ☰
        </button>
        {menuOpen && (
          <div className={styles.responsiveMenu}>
            <Link href="/profile"  className={router.pathname === "/profile" ? styles.activeLink : ""}>
              {profileName}
            </Link>

            <Link
              href="/"
              className={router.pathname === "/" ? styles.activeLink : ""}
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              href="/data"
              className={router.pathname === "/data" ? styles.activeLink : ""}
              onClick={toggleMenu}
            >
              Data
            </Link>
            <Link
              href="/control"
              className={router.pathname === "/control" ? styles.activeLink : ""}
              onClick={toggleMenu}
            >
              Control
            </Link>
            <Logout onClick={() => toggleMenu()} />
          </div>
        )}
      </nav>
    );
  } else {
    return <></>;
  }
}
