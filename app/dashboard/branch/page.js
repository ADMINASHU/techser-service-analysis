"use client";
import { useState, useContext } from "react";
import styles from "../Dashboard.module.css";
import DashboardTableView from "./(components)/DashboardTableView";
import DataCompile from "./(components)/DataCompile";
import DataContext from "../../../context/DataContext";

const DashboardPage = () => {
  const [data, setData] = useState([]);
  const { processedData } = useContext(DataContext);

  const onDataProcessed = (data) => {
    setData(data);
  };
  return (
    <div className={styles.dash}>
      <h1>Dashboard Branch</h1>
      <DataCompile proData={processedData} onDataProcessed={onDataProcessed} />
      <DashboardTableView data={data} />
    </div>
  );
};

export default DashboardPage;
