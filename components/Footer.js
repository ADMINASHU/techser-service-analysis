"use client";
import Link from "next/link";
import styles from "./Footer.module.css";
import { usePathname } from "next/navigation";
const Footer = ({ isAuthenticated }) => {
  const pathname = usePathname();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.brandSection}>
          © {new Date().getFullYear()}{" "}
          <span className={styles.brandText}>Techser Analysis App</span>
        </div>
        <div className={styles.legalLinks}>
          <Link href="/privacy" className={pathname === "/privacy" ? styles.activeLink : ""}>
            Privacy
          </Link>
          <Link href="/terms" className={pathname === "/terms" ? styles.activeLink : ""}>
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
