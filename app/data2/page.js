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
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [series, setSeries] = useState("");
  const [model, setModel] = useState("");
  const [capacity, setCapacity] = useState("");

  useEffect(() => {
    // Filter data based on selected filters
    const filtered = cpData.filter(
      (item) =>
        (region ? item.region === region : true) &&
        (branch ? item.branch === branch : true) &&
        (name ? item.name === name : true) &&
        (category ? item.category === category : true) &&
        (series ? item.series === series : true) &&
        (model ? item.model === model : true) &&
        (capacity ? item.capacity === capacity : true)
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  }, [region, branch, name, category, series, model, capacity, cpData]);

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

  // Define the columns in the desired order, without region and branch
  const columns = ["prodId", "prodDescription", "name", "category", "series", "model", "capacity", "capacityUnit"];

  // Get unique values for filters
  const regions = [...new Set(cpData.map((item) => item.region))];
  const branches = [...new Set(cpData.map((item) => item.branch))];
  const names = [...new Set(cpData.map((item) => item.name))];
  const categories = [...new Set(cpData.map((item) => item.category))];
  const seriesList = [...new Set(cpData.map((item) => item.series))];
  const models = [...new Set(cpData.map((item) => item.model))];
  const capacities = [...new Set(cpData.map((item) => item.capacity))];

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
        <label>
          Name:
          <select
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.select}
          >
            <option value="">All</option>
            {names.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label>
          Category:
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={styles.select}
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>
        <label>
          Series:
          <select
            value={series}
            onChange={(e) => setSeries(e.target.value)}
            className={styles.select}
          >
            <option value="">All</option>
            {seriesList.map((ser) => (
              <option key={ser} value={ser}>
                {ser}
              </option>
            ))}
          </select>
        </label>
        <label>
          Model:
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className={styles.select}
          >
            <option value="">All</option>
            {models.map((mod) => (
              <option key={mod} value={mod}>
                {mod}
              </option>
            ))}
          </select>
        </label>
        <label>
          Capacity:
          <select
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            className={styles.select}
          >
            <option value="">All</option>
            {capacities.map((cap) => (
              <option key={cap} value={cap}>
                {cap}
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
