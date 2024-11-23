"use client";

import React, { useContext, useEffect, useState } from "react";
import TableView from "./(components)/TableView";


const DataPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const cachedData = retrieveDataFromLocalStorage("analysisData");
    if (cachedData) {
      setData(cachedData);
    }
  }, []);

  const selectedColumns = [
    "complaintID",
    "natureOfComplaint",
    "regDate",
    "closedDate",
    "duration",
    "realStatus",
    "assignedTo",
    "region",
    "branch",
    "month",
    "year",
    "count",
    "isPending",
    "cPoint",
    "ePoint",
    "bPoint",
    "rPoint",
  ];

  return (
    <div>
      <h1>Complaint Data</h1>
      <TableView data={data} selectedColumns={selectedColumns} />
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

export default DataPage;
