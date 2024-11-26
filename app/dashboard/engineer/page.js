"use client";
import { useState, useEffect } from "react";
import styles from "../Dashboard.module.css";
import DashboardTableView from "./(components)/DashboardTableView";
import DataCompile from "./(components)/DataCompile";
import { useContext } from "react"; 
import DataContext from "../../../context/DataContext";

const DashboardPage = () => {
  // const [proData, setProData] = useState([]);
  const [data, setData] = useState([]);
//  const { processedData } = useContext(DataContext);

  // useEffect(() => {
  //   const cachedData = retrieveDataFromLocalStorage("analysisData");
  //   if (cachedData) {
  //     setProData(cachedData);
  //   }
  // }, []);

  const onDataProcessed = (data) => {
    setData(data);
  };
  return (
    <div className={styles.dash}>
      <h1>Dashboard Engineer</h1>
      <DataCompile onDataProcessed={onDataProcessed} />
      <DashboardTableView data={data} />
      {/* <div>{JSON.stringify(processedData)}</div> */}
    </div>
  );
};
// const retrieveDataFromLocalStorage = (key) => {
//   if (typeof window !== "undefined") {
//     const data = localStorage.getItem(key);
//     return data ? JSON.parse(data) : null;
//   }
//   return null;
// };

export default DashboardPage;
