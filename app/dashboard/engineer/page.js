import styles from "../Dashboard.module.css";

import DataCompile from "./(components)/DataCompile";

const DashboardPage = () => {

  return (
    <div className={styles.dash}>
      {/* <h1>Dashboard Engineer</h1> */}
      <DataCompile />
    </div>
  );
};

export default DashboardPage;
