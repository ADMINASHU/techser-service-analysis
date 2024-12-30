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
          <span className={styles.brandText}>Techser Analysis App</span>
        </div>
        <div className={styles.legalLinks}>
          <Link href="/privacy" className={styles.link}>Privacy</Link>
          <Link href="/terms" className={styles.link}>Terms</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
