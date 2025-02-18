"use client";

import React, { useContext, useState, useEffect } from "react";
import ProductContext from "@/context/ProductContext";
import styles from "./Data2.module.css";

const Data2 = () => {
  const { cpData } = useContext(ProductContext);
  const [filteredData, setFilteredData] = useState([]);
  const [uniqueProdIdData, setUniqueProdIdData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(100);
  const [region, setRegion] = useState("");
  const [branch, setBranch] = useState("");

  useEffect(() => {
    // Filter data based on region and branch
    const filtered = cpData.filter(
      (item) => (region ? item.region === region : true) && (branch ? item.branch === branch : true)
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  }, [region, branch, cpData]);

  useEffect(() => {
    // Calculate unique values for prodId
    const uniqueProdIds = {};
    filteredData.forEach((item) => {
      if (!uniqueProdIds[item.prodId]) {
        uniqueProdIds[item.prodId] = {
          ...item,
          breakdown: 0,
        };
      }
      uniqueProdIds[item.prodId].breakdown += parseFloat(item.breakdown || 0);
    });
    setUniqueProdIdData(uniqueProdIds);
  }, [filteredData]);

  // Get unique column names dynamically, excluding specified columns
  const columns =
    cpData.length > 0
      ? Object.keys(cpData[0]).filter(
          (col) =>
            ![
              "_id",
              "__v",
              "id",
              "batMake",
              "batType",
              "batteryCapacity",
              "batteryCode",
              "batteryQty",
              "serialNo",
              //   "series",
              "pincode",
              //   "model",
              "modelCode",
              //   "capacityUnit",
              //   "category",
              "city",
              "branch",
              //   "capacity",
              "custId",
              "customerAddress",
              "customerName",
              "state",
              "breakdown",
              "installation",
              "pm",
              "callIds",
            ].includes(col)
        )
      : [];

  // Get unique values for region and branch for select options
  const regions = [...new Set(cpData.map((item) => item.region))];
  const branches = [...new Set(cpData.map((item) => item.branch))];

  // Function to render the cell, handling callIds array length
  const renderCell = (col, value) => {
    if (col === "callIds") {
      return value.length; // Display the length of the callIds array
    }
    return value;
  };

  // Convert uniqueProdIdData to an array for rendering
  const uniqueProdIdArray = Object.values(uniqueProdIdData);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Customer Product Data</h1>
      <div className={styles.filterContainer}>
        <label>
          Region:
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className={styles.select}
          >
            <option value="">All</option>
            {regions.map((reg) => (
              <option key={reg} value={reg}>
                {reg}
              </option>
            ))}
          </select>
        </label>
        <label>
          Branch:
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className={styles.select}
          >
            <option value="">All</option>
            {branches.map((br) => (
              <option key={br} value={br}>
                {br}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
              <th>Total Breakdown</th>
            </tr>
          </thead>
          <tbody>
            {uniqueProdIdArray
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((item, index) => (
                <tr key={index}>
                  {columns.map((col) => (
                    <td key={`${index}-${col}`}>{renderCell(col, item[col])}</td>
                  ))}
                  <td>{item.breakdown || 0}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className={styles.pagination}>
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(prev + 1, Math.ceil(uniqueProdIdArray.length / itemsPerPage))
            )
          }
          disabled={currentPage === Math.ceil(uniqueProdIdArray.length / itemsPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Data2;
