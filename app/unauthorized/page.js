'use client';

import styles from './Unauthorized.module.css';

const Unauthorized = () => {
  return (
    <div className={styles.container}>
      <h1>you're not authorized to access this page</h1>
    </div>
  );
};

export default Unauthorized;
