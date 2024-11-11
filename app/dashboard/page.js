import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';

const Dashboard = () => {
  return (
    <div className={styles.container}>
      <h1>Dashboard</h1>
      <p>This is the Dashboard.</p>
      <p>This is the Dashboard.</p>
      <p>This is the Dashboard.</p>
      <p>This is the Dashboard.</p>
      <p>This is the Dashboard.</p>
      <Link href="/">Go back to Home</Link>
    </div>
  );
};

export default Dashboard;
