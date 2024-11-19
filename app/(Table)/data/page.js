"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import DataExtractor from "./(components)/dataExtractor";
import TableView from "./(components)/TableView";

const DataPage = () => {
  const [data, setData] = useState([]);
  const [processedData, setProcessedData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/data");
        const result = JSON.stringify(response.data);
        console.log(result);
        setData(response.data);
      } catch (error) {
        throw new Error(error.message);
      }
    }
    fetchData();
  }, []);

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
  ];

  const points = {
    Breakdown: {
      eng: { new: 0, pending: 1, closed: [2, 2.5, 3] },
      branch: { new: -0.1, pending: -0.05, closed: 0 },
      region: { new: 0, pending: 0, closed: 0 },
    },
    Installation: {
      eng: { new: 0, pending: 1, closed: [2, 2.5, 3] },
      branch: { new: 0, pending: -0.25, closed: 0.2 },
      region: { new: 0, pending: 0, closed: 0 },
    },
    Pm: {
      eng: { new: 0, pending: 1.5, closed: [2, 3, 3] },
      branch: { new: 0, pending: -0.5, closed: 0.1 },
      region: { new: 0, pending: 0, closed: 0 },
    },
  };
  return (
    <div>
      <h1>Complaint Data</h1>
      {/* <p>{JSON.stringify(data)}</p> */}
      {/* <Logout/> */}
      <DataExtractor data={data} onDataProcessed={setProcessedData} />
      <TableView data={processedData} selectedColumns={selectedColumns} />
    </div>
  );
};

export default DataPage;
