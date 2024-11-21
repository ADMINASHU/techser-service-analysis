"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Logout from "./Logout";
import { useRouter } from "next/navigation";
import styles from "./Navbar.module.css"; // Import CSS module
import Image from "next/image";
import { usePathname } from 'next/navigation'

export default function Navbar({ session }) {
  const isAuthenticated = !!session?.user;
  const [menuOpen, setMenuOpen] = useState(false);
 
  const profileName = session?.user?.email || "User"; // Replace with actual logic to get profile name
  const pathname = usePathname()

useEffect(() => {
  
  console.log("path:");
  console.log(pathname);
  
 
}, [pathname])


  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  if (isAuthenticated) {
    return (
      <nav className={styles.navbar}>
        <div className={styles.navLinks}>
          <Link href="/" className={pathname === "/" ? styles.activeLink : ""}>
          <Image
          src="/logo.png" // Path to your image
          alt="Company image" // Alt text for accessibility
          width={100} // Display width
          height={20}
          className={styles.logo} // Display height
        />
          </Link>
          {/* <Link href="/" className={pathname === "/" ? styles.activeLink : ""}>
            Home
          </Link> */}
          <Link href="/dashboard" className={pathname === "/dashboard" ? styles.activeLink : styles.nlink}>
            Dashboard
          </Link>
          <Link href="/data" className={pathname === "/data" ? styles.activeLink : styles.nlink}>
            Data
          </Link>
          <Link href="/control" className={pathname === "/control" ? styles.activeLink : styles.nlink}>
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
            <Link href="/profile"  className={pathname === "/profile" ? styles.activeLink : ""}>
              {profileName}
            </Link>

            <Link
              href="/"
              className={pathname === "/" ? styles.activeLink : ""}
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className={pathname === "/dashboard" ? styles.activeLink : ""}
              onClick={toggleMenu}
            >
              Dashboard
            </Link>
            <Link
              href="/data"
              className={pathname === "/data" ? styles.activeLink : ""}
              onClick={toggleMenu}
            >
              Data
            </Link>
            <Link
              href="/control"
              className={pathname === "/control" ? styles.activeLink : ""}
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
