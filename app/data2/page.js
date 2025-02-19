"use client";

import React, { useContext, useState, useEffect, useMemo } from "react"; // Add useMemo
import ProductContext from "@/context/ProductContext";
import styles from "../dashboard/Dashboard.module.css";
import { utils, writeFile } from "xlsx"; // Add this import
import { regionList } from "@/lib/regions";

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
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

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

  // Update the columns array with proper header texts
  const columns = [
    { id: "prodId", label: "Product ID" },
    { id: "prodDescription", label: "Product Description" },
    { id: "category", label: "Category" },
    { id: "series", label: "Series" },
    { id: "model", label: "Model" },
    { id: "name", label: "Product" },
    { id: "capacity", label: "Capacity" }
  ];

  // Get unique values for filters
  const regions = [...new Set(cpData.map((item) => item.region))];
  const branches = [...new Set(cpData.map((item) => item.branch))];
  const names = [...new Set(cpData.map((item) => item.name))];
  const categories = [...new Set(cpData.map((item) => item.category))];
  const seriesList = [...new Set(cpData.map((item) => item.series))];
  const models = [...new Set(cpData.map((item) => item.model))];

  const getUniqueCapacities = () => {
    const capacities = cpData.map((item) => ({
      capacity: item.capacity,
      capacityUnit: item.capacityUnit,
    }));
    const uniqueCapacities = capacities.reduce((acc, current) => {
      const x = acc.find(
        (item) => item.capacity === current.capacity && item.capacityUnit === current.capacityUnit
      );
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
    return uniqueCapacities;
  };

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

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    const dataToSort = [...uniqueProdIdArray];
    if (sortConfig.key) {
      return dataToSort.sort((a, b) => {
        const aValue = isNaN(a[sortConfig.key]) ? a[sortConfig.key] : parseFloat(a[sortConfig.key]);
        const bValue = isNaN(b[sortConfig.key]) ? b[sortConfig.key] : parseFloat(b[sortConfig.key]);

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return dataToSort;
  }, [uniqueProdIdArray, sortConfig]);

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
          {getUniqueCapacities().map((item, index) => (
            <option key={index} value={item.capacity}>
              {`${item.capacity} ${item.capacityUnit}`}
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
              <th className={styles.tableHeader}>S No</th>
              {columns.map(({ id, label }) => (
                <th 
                  key={id} 
                  className={styles.tableHeader}
                  onClick={() => handleSort(id)}
                >
                  {label}{" "}
                  {sortConfig.key === id && (
                    <span className={styles.sortIndicator}>
                      {sortConfig.direction === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
              ))}
              <th 
                className={styles.tableHeader}
                onClick={() => handleSort("breakdown")}
              >
                Breakdown{" "}
                {sortConfig.key === "breakdown" && (
                  <span className={styles.sortIndicator}>
                    {sortConfig.direction === "asc" ? "▲" : "▼"}
                  </span>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((item, index) => (
                <tr key={index} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    <div className={styles.tableCellContent}>
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </div>
                  </td>
                  {columns.map(({ id }) => (
                    <td key={`${index}-${id}`} className={styles.tableCell}>
                      <div className={styles.tableCellContent}>
                        {id === "capacity" 
                          ? `${item[id]} ${item.capacityUnit}`
                          : renderCell(id, item[id])}
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
                Math.ceil(sortedData.length / itemsPerPage)
              )
            )
          }
          disabled={
            currentPage === Math.ceil(sortedData.length / itemsPerPage)
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Data2;
