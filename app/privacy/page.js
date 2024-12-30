import React from "react";
import styles from "./Privacy.module.css";

const Privacy = () => {
  return (
    <div className={styles.container}>
      <h1>Privacy Policy</h1>
      <p>Last updated: 01 JAN 2025</p>

      <p>
        Welcome to Techser Analysis App. This Privacy Policy explains how we collect, use, disclose, and
        safeguard your information when you visit our website.
      </p>
      <h2>Information We Collect</h2>
      <p>
        We may collect information about you in a variety of ways. The information we may collect on
        the Site includes:
      </p>
      <ul>
        <li>Personal Data</li>
        <li>Derivative Data</li>
        <li>Device Data</li>
      </ul>
      <h2>Use of Your Information</h2>
      <p>
        Having accurate information about you permits us to provide you with a smooth, efficient,
        and customized experience. Specifically, we may use information collected about you via the
        Site to:
      </p>
      <ul>
        <li>Create and manage your account.</li>
        <li>Email you regarding your account or profile.</li>
        <li>
          Generate a personal profile about you to make future visits to the Site more personalized.
        </li>
      </ul>
      <h2>Contact Us</h2>
      <p>
        If you have questions or comments about this Privacy Policy, please contact us at:
        support@techser.com
      </p>
    </div>
  );
};

export default Privacy;
