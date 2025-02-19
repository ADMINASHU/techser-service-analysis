"use client";

import React, { useContext, useState, useEffect } from "react";
import ProductContext from "@/context/ProductContext";
import styles from "../dashboard/Dashboard.module.css";
import { utils, writeFile } from "xlsx"; // Add this import
import { regionList } from "@/lib/regions";


const Data2 = () => {
  const {cpData } = useContext(ProductContext);
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

  const getBranchesForRegion = (region) => {
    const branches = new Set();
    cpData.forEach((row) => {
      if ((region === "" || row.region === region) && row.branch !== "Branch") {
        branches.add(row.branch);
      }
    });
    return Array.from(branches);
  };

  // Convert uniqueProdIdData to an array for rendering
  const uniqueProdIdArray = Object.values(uniqueProdIdData);

  const handleResetFilters = () => {
    setRegion("");
    setBranch("");
    setName("");
    setCategory("");
    setSeries("");
    setModel("");
    setCapacity("");
  };

  const handleExportToExcel = () => {
    const exportData = uniqueProdIdArray.map(({ 
      region,
      branch,
      prodId, 
      prodDescription, 
      name, 
      category, 
      series, 
      model, 
      capacity, 
      capacityUnit, 
      breakdown 
    }) => ({
      region,
      branch,
      prodId,
      prodDescription,
      name,
      category,
      series,
      model,
      capacity,
      capacityUnit,
      breakdown: breakdown || 0
    }));

    const worksheet = utils.json_to_sheet(exportData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Customer Product Data");
    writeFile(workbook, "CustomerProductData.xlsx");
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.header}>Customer Product Data</h1>
      <div className={styles.filterContainer}>
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className={styles.select}
        >
          <option value="">ALL Region</option>
          {regionList.map((reg) => (
            <option key={reg} value={reg}>
              {reg}
            </option>
          ))}
        </select>
        <select name="branch" value={branch}  onChange={(e) => setBranch(e.target.value)}>
          <option value="">ALL Branch</option>
          {getBranchesForRegion(region).map((br, index) => (
            <option key={index} value={br}>
              {br}
            </option>
          ))}
        </select>
        <select
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.select}
        >
          <option value="">All Products</option>
          {names.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={styles.select}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={series}
          onChange={(e) => setSeries(e.target.value)}
          className={styles.select}
        >
          <option value="">All Series</option>
          {seriesList.map((ser) => (
            <option key={ser} value={ser}>
              {ser}
            </option>
          ))}
        </select>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className={styles.select}
        >
          <option value="">All Models</option>
          {models.map((mod) => (
            <option key={mod} value={mod}>
              {mod}
            </option>
          ))}
        </select>
        <select
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          className={styles.select}
        >
          <option value="">All Capacities</option>
          {capacities.map((cap) => (
            <option key={cap} value={cap}>
              {cap}
            </option>
          ))}
        </select>
        <button className={styles.ResetButton} onClick={handleResetFilters}>
          Reset Filters
        </button>
        <button className={styles.button} onClick={handleExportToExcel}>
          Export
        </button>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col} className={styles.tableHeader}>
                  {col}
                </th>
              ))}
              <th className={styles.tableHeader}>Total Breakdown</th>
            </tr>
          </thead>
          <tbody>
            {uniqueProdIdArray
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((item, index) => (
                <tr key={index} className={styles.tableRow}>
                  {columns.map((col) => (
                    <td key={`${index}-${col}`} className={styles.tableCell}>
                      <div className={styles.tableCellContent}>
                        {renderCell(col, item[col])}
                      </div>
                    </td>
                  ))}
                  <td className={styles.tableCell}>
                    <div className={styles.tableCellContent}>
                      {item.breakdown || 0}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className={styles.paginationContainer}>
        <button
          className={styles.pageButton}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className={styles.pageButton}
          onClick={() =>
            setCurrentPage((prev) =>
              Math.min(
                prev + 1,
                Math.ceil(uniqueProdIdArray.length / itemsPerPage)
              )
            )
          }
          disabled={
            currentPage === Math.ceil(uniqueProdIdArray.length / itemsPerPage)
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Data2;
