"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import DataExtractor from "./(components)/dataExtractor";
import TableView from "./(components)/TableView";

const DataPage = () => {
  const [points, setPoints] = useState({});
  const [data, setData] = useState([]);
  const [processedData, setProcessedData] = useState([]);

  useEffect(() => {
    fetchPoints();
    fetchData();
  
  }, []);
  async function fetchData() {
    try {
      const response = await axios.get("/api/data");
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
  ];

  return (
    <div>
      <h1>Complaint Data</h1>
      {/* <p>{JSON.stringify(data)}</p> */}
      {/* <Logout/> */}
      <DataExtractor data={data} onDataProcessed={setProcessedData} points={points} />
      <TableView data={processedData} selectedColumns={selectedColumns} />
    </div>
  );
};

export default DataPage;
