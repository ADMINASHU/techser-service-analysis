"use client";
import { useState, useContext } from "react";
import styles from "../Dashboard.module.css";
import DashboardTableView from "./(components)/DashboardTableView";
import DataCompile from "./(components)/DataCompile";
import DataContext from "../../../context/DataContext";

const DashboardPage = () => {
  const [data, setData] = useState([]);
  const [averageTotalVisits, setAverageTotalVisits] = useState(0);

  const { processedData } = useContext(DataContext);

  const onDataProcessed = (finalDataWithHeader, averageTotalVisits ) => {
    setData(finalDataWithHeader);
    setAverageTotalVisits(averageTotalVisits);
  };
  return (
    <div className={styles.dash}>
      <h1>Dashboard Region</h1>
      <DataCompile proData={processedData} onDataProcessed={onDataProcessed} />
      <DashboardTableView data={data} averageTotalVisits = {averageTotalVisits}/>

    </div>
  );
};

export default DashboardPage;
