"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import TableDisplayAndFilters from "./(components)/tableDisplayAndFilters";
import DataExtractor from "./(components)/dataExtractor";
import TableView from "./(components)/TableView";

const DataPage = () => {
  const [data, setData] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  // const [filters, setFilters] = useState({
  //   year: "",
  //   month: "",
  //   region: "",
  //   branch: "",
  //   natureOfComplaint: "",
  //   newStatus: "",
  //   assignedTo: "",
  // });
  // const handleFilterChange = (e) => {
  //   const { name, value } = e.target;
  //   setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  // };

  useEffect(() => {
    const fetchCookies = async () => {
      const apiURL = "/api/webapp";
      try {
        const response = await axios.get(apiURL);
        // setCookie(response.data);
        return response.data;
      } catch (err) {
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
        // console.log("page: " + data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);
  const selectedColumns = [16,18,3,14,15,26,20,21,22,23,24,25];
  return (
    <div>
      <h1>Complaint Data</h1>
      <DataExtractor data={data} onDataProcessed={setProcessedData} />
      {/* <TableDisplayAndFilters
        processedData={processedData}
        filters={filters}
        setFilters = {setFilters}
        handleFilterChange={handleFilterChange}
      /> */}
      <TableView data={processedData} selectedColumns={selectedColumns}/>
    </div>
  );
};

export default DataPage;
