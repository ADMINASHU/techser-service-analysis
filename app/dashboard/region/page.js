"use client";
import { useState, useEffect } from "react";
import styles from "../Dashboard.module.css";
import DashboardTableView from "./(components)/DashboardTableView";
import DataCompile from "./(components)/DataCompile";

const DashboardPage = () => {
  const [proData, setProData] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const cachedData = retrieveDataFromLocalStorage("analysisData");
    if (cachedData) {
      setProData(cachedData);
    }
  }, []);

  const onDataProcessed = (data) => {
    setData(data);
  };
  return (
    <div className={styles.dash}>
      <h1>Dashboard Region</h1>
      <DataCompile proData={proData} onDataProcessed={onDataProcessed} />
      <DashboardTableView data={data} />
      {/* <div>{JSON.stringify(data)}</div> */}
    </div>
  );
};
const retrieveDataFromLocalStorage = (key) => {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
  return null;
};

export default DashboardPage;
