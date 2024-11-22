"use client";

import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import DataExtractor from "./(components)/dataExtractor";
import TableView from "./(components)/TableView";
import DataContext from "../../../context/DataContext";

const DataPage = () => {
  const [points, setPoints] = useState({});
  const [data, setData] = useState([]);
  const {processedData, setProcessedData}= useContext(DataContext);

  useEffect(() => {
    // fetchPoints();
    fetchData();
  
  }, []);
  async function fetchData() {
    try {
      const response = await axios.get("/api/proData");
      const result = JSON.stringify(response.data);
      // console.log(result);
      setData(response.data);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const fetchPoints = async () => {
    try {
      const response = await axios.get('/api/control');
      setPoints(response.data);
    } catch (error) {
      console.error('Error fetching points:', error);
    }
  };

  const selectedColumns = [
    "complaintID",
    "natureOfComplaint",
    "callDate",
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
      {/* <p>{JSON.stringify(data)}</p> */}
      {/* <Logout/> */}
      {/* <DataExtractor data={data} onDataProcessed={setProcessedData} points={points} /> */}
      <TableView data={data} selectedColumns={selectedColumns} />
    </div>
  );
};

export default DataPage;
