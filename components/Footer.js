import Link from "next/link";
import styles from "./Footer.module.css";

const Footer = ({ isAuthenticated, loggedUser }) => {
  const level = loggedUser?.level;

  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.brandSection}>
          © {new Date().getFullYear()}{' '}
          <span className={styles.brandText}>Techser</span>
        </div>
        {/* Navigation links will be hidden on mobile */}
        <div className={styles.navLinks}>
          <Link href="/dashboard/engineer" className={styles.link}>Engineer</Link>
          <Link href="/dashboard/branch" className={styles.link}>Branch</Link>
          <Link href="/dashboard/region" className={styles.link}>Region</Link>
          <span className={styles.divider}>|</span>
          {level <= 1 && <Link href="/data" className={styles.link}>Data</Link>}
          {level <= 3 && <Link href="/users" className={styles.link}>Users</Link>}
        </div>
        {/* Legal links will remain visible */}
        <div className={styles.legalLinks}>
          <Link href="/privacy" className={styles.link}>Privacy</Link>
          <Link href="/terms" className={styles.link}>Terms</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
