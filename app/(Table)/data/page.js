"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import TableDisplayAndFilters from "./(components)/tableDisplayAndFilters";
import DataExtractor from "./(components)/dataExtractor";

const DataPage = () => {
  const [data, setData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  const [filters, setFilters] = useState({
    year: "",
    month: "",
    region: "",
    branch: "",
    natureOfComplaint: "",
    newStatus: "",
    assignedTo: "",
  });
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  useEffect(() => {
    const fetchCookies = async () => {
      const apiURL = "/api/webapp";
      try {
        const response = await axios.get(apiURL);
        // setCookie(response.data);
        return response.data;
      } catch (err) {
        setError("Error fetching data from the server");
        console.error(err);
      }
    };
    const fetchData = async () => {
      const apiURL2 = "/api/serviceease";
      const payload = {
        month: 11,
        year: 2024,
        region: "",
        branch: "",
        type: "All",
        callstatus: "",
      };
      const cookies = await fetchCookies();
      const send = { payload, cookies };
      try {
        const response2 = await axios.post(apiURL2, send);
        setData(response2.data);
        console.log("page: " + result);
      } catch (err) {
        setError("Error fetching data from the server");
        console.error(err);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Data Extraction and Table Display</h1>
      <DataExtractor data={data} onDataProcessed={setProcessedData} />
      <TableDisplayAndFilters
        processedData={processedData}
        filters={filters}
        handleFilterChange={handleFilterChange}
      />
    </div>
  );
};

export default DataPage;
