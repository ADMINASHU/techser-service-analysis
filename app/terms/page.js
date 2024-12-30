import React from 'react';
import styles from './Terms.module.css';

const Terms = () => {
  return (
    <div className={styles.container}>
      <h1>Terms of Service</h1>
      <p>Last updated: [Date]</p>
      <p>
        Welcome to Techser. These terms and conditions outline the rules and regulations for the use of Techser's Website.
      </p>
      <h2>Acceptance of Terms</h2>
      <p>
        By accessing this website we assume you accept these terms and conditions. Do not continue to use Techser if you do not agree to take all of the terms and conditions stated on this page.
      </p>
      <h2>License</h2>
      <p>
        Unless otherwise stated, Techser and/or its licensors own the intellectual property rights for all material on Techser. All intellectual property rights are reserved. You may access this from Techser for your own personal use subjected to restrictions set in these terms and conditions.
      </p>
      <h2>User Comments</h2>
      <p>
        Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. Techser does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of Techser, its agents, and/or affiliates.
      </p>
      <h2>Contact Us</h2>
      <p>
        If you have any questions about these Terms, please contact us at: support@techser.com
      </p>
    </div>
  );
};

export default Terms;
