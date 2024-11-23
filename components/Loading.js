import styles from './Loading.module.css';

const Loading = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingBar}></div>
      <p className={styles.loadingMessage}>Please wait, your data is loading... Do not refresh the page.</p>
    </div>
  );
};

export default Loading;
