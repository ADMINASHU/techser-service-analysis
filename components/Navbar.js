"use client";

import React, { useState, useEffect, useContext } from "react";
import Link from "next/link";
import Logout from "./Logout";
import { useRouter } from "next/navigation";
import styles from "./Navbar.module.css"; // Import CSS module
import Image from "next/image";
import { usePathname } from "next/navigation";
import DataContext from "../context/DataContext";
import Swal from "sweetalert2";

export default function Navbar({ session }) {
  const { processedData, totalRows, loading } = useContext(DataContext); // Use DataContext to access processedData and loading state
  const isAuthenticated = !!session?.user;
  const isAdmin = session?.user?.isAdmin;
  const verified = session?.user?.verified;
  const [menuOpen, setMenuOpen] = useState(false);
  const [dashOpen, setDashOpen] = useState(false);

  const profileName = session?.user?.userID || "User"; // Replace with actual logic to get profile name
  const pathname = usePathname();

  useEffect(() => {
    if (isAuthenticated && !verified) {
      Swal.fire({
        title: "Profile not verified!",
        text: "Please contact your organization.",
        icon: "info",
        confirmButtonText: "Go to Profile",
        showCancelButton: true,
        cancelButtonText: "OK",
        html: `<p>Please contact your organization.</p>`,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/profile";
        }
      });
    }
  }, [verified]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const toggleDash = () => {
    setDashOpen(!dashOpen);
  };

  // Calculate progress
  const progress = (processedData.length / totalRows) * 100;

  if (isAuthenticated) {
    return (
      <nav className={styles.navbar}>
        {loading && (
          <div className={styles.progressBarContainer}>
            <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
          </div>
        )}
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

          <Link href="/users" className={pathname === "/users" ? styles.activeLink : styles.nlink}>
            Users
          </Link>

          <Link
            href="/control"
            className={pathname === "/control" ? styles.activeLink : styles.nlink}
          >
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
            <Link
              href="/data"
              className={pathname === "/data" ? styles.activeLink : ""}
              onClick={toggleMenu}
            >
              Data
            </Link>

            <Link
              href="/users"
              className={pathname === "/users" ? styles.activeLink : styles.nlink}
            >
              Users
            </Link>

            <Link
              href="/control"
              className={pathname === "/control" ? styles.activeLink : styles.nlink}
            >
              Control
            </Link>
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
