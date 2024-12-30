import React from "react";
import styles from "./Terms.module.css";

const Terms = () => {
  return (
    <div className={styles.container}>
      <h1>Terms of Service</h1>
      <p>Last updated: 01 JAN 2025</p>
      <p>
        Welcome to Techser Analysis App. These terms and conditions outline the rules and regulations for the use
        of Techser&apos;s Analysis Website.
      </p>
      <h2>Acceptance of Terms</h2>
      <p>
        By accessing this website we assume you accept these terms and conditions. Do not continue
        to use Techser Analysis App if you do not agree to take all of the terms and conditions stated on this
        page.
      </p>
      <h2>License</h2>
      <p>
        Unless otherwise stated, Techser Analysis App and/or its licensors own the intellectual property rights
        for all material on Techser. All intellectual property rights are reserved. You may access
        this from Techser Analysis App for your own personal use subjected to restrictions set in these terms and
        conditions.
      </p>
      <h2>Contact Us</h2>
      <p>If you have any questions about these Terms, please contact us at: support@techser.com</p>
    </div>
  );
};

export default Terms;
