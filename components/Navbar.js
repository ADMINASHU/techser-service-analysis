"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Logout from "./Logout";
import { useRouter } from "next/navigation";
import styles from "./Navbar.module.css"; // Import CSS module
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar({ session }) {
  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user?.isAdmin;
  const [menuOpen, setMenuOpen] = useState(false);
  const [dashOpen, setDashOpen] = useState(false);

  const profileName = session?.user?.email || "User"; // Replace with actual logic to get profile name
  const pathname = usePathname();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const toggleDash = () => {
    setDashOpen(!dashOpen);
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
          <Link
            href=""
            className={
              pathname === "/dashboard/engineer" ||
              pathname === "/dashboard/branch" ||
              pathname === "/dashboard/region" ||
              pathname === "/dashboard/customer"
                ? styles.activeLink
                : styles.nlink
            }
            onClick={toggleDash}
          >
            Dashboard
          </Link>
          <Link href="/data" className={pathname === "/data" ? styles.activeLink : styles.nlink}>
            Data
          </Link>
          {isAdmin && (
            <Link
              href="/control"
              className={pathname === "/control" ? styles.activeLink : styles.nlink}
            >
              Control
            </Link>
          )}
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
            <Link href="/profile" className={pathname === "/profile" ? styles.activeLink : ""}>
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
            {isAdmin && (
              <Link
                href="/control"
                className={pathname === "/control" ? styles.activeLink : ""}
                onClick={toggleMenu}
              >
                Control
              </Link>
            )}
            <Logout onClick={() => toggleMenu()} />
          </div>
        )}
        {dashOpen && (
          <div className={styles.responsiveDash}>
            <Link
              href="/dashboard/engineer"
              className={pathname === "/dashboard/engineer" ? styles.activeLink : ""}
              onClick={toggleDash}
            >
              Engineer
            </Link>
            <Link
              href="/dashboard/branch"
              className={pathname === "/dashboard/branch" ? styles.activeLink : ""}
              onClick={toggleDash}
            >
              Branch
            </Link>
            <Link
              href="/dashboard/region"
              className={pathname === "/dashboard/region" ? styles.activeLink : ""}
              onClick={toggleDash}
            >
              Region
            </Link>
            <Link
              href="/dashboard/customer"
              className={pathname === "/dashboard/customer" ? styles.activeLink : ""}
              onClick={toggleDash}
            >
              Customer
            </Link>
          </div>
        )}
      </nav>
    );
  } else {
    return <></>;
  }
}
