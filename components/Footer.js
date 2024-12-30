import Link from 'next/link';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.brandSection}>
          © {new Date().getFullYear()} <span className={styles.brandText}>Techser Analysis</span>
        </div>
        <div className={styles.navLinks}>
          <Link href="/dashboard/engineer" className={styles.link}>Engineer</Link>
          <Link href="/dashboard/branch" className={styles.link}>Branch</Link>
          <Link href="/dashboard/region" className={styles.link}>Region</Link>
          <span className={styles.divider}>|</span>
          <Link href="/data" className={styles.link}>Data</Link>
          <Link href="/help" className={styles.link}>Help</Link>
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
