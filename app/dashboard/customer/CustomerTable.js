"use client";

import React, { useContext, useState } from "react";
import ProductContext from "@/context/ProductContext";
import styles from "../Dashboard.module.css";

const CustomerTable = () => {
  const { customerData, filters, setFilters } = useContext(ProductContext);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const sortedCustomerData = [...customerData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });
  const handleResetFilters = () => {
    setFilters({
      region: "",
      branch: "",
      name: "",
      category: "",
      series: "",
      model: "",
      capacity: "",
    });
  };

  const handleExportToExcel = () => {
    const exportData = customerData.map(({ serialNo, ...rest }) => rest);
    const worksheet = utils.json_to_sheet(exportData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "customer Data");
    writeFile(workbook, "customerData.xlsx");
  };
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };
  const getUniqueValues = (key) => {
    return [...new Set(customerData.map((item) => item[key]))];
  };
  const getUniqueCapacities = () => {
    const capacities = customerData.map((item) => ({
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

  return (
    <div className={styles.page}>
      <div className={styles.filterContainer}>
        <select name="region" value={filters.region} onChange={handleFilterChange}>
          <option value="">All Regions</option>
          {getUniqueValues("region").map((region, index) => (
            <option key={index} value={region}>
              {region}
            </option>
          ))}
        </select>
        <select name="branch" value={filters.branch} onChange={handleFilterChange}>
          <option value="">All Branches</option>
          {getUniqueValues("branch").map((branch, index) => (
            <option key={index} value={branch}>
              {branch}
            </option>
          ))}
        </select>
        <select name="name" value={filters.name} onChange={handleFilterChange}>
          <option value="">All Products</option>
          {getUniqueValues("name").map((name, index) => (
            <option key={index} value={name}>
              {name}
            </option>
          ))}
        </select>
        <select name="category" value={filters.category} onChange={handleFilterChange}>
          <option value="">All Categories</option>
          {getUniqueValues("category").map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select name="series" value={filters.series} onChange={handleFilterChange}>
          <option value="">All Series</option>
          {getUniqueValues("series").map((series, index) => (
            <option key={index} value={series}>
              {series}
            </option>
          ))}
        </select>
        <select name="model" value={filters.model} onChange={handleFilterChange}>
          <option value="">All Models</option>
          {getUniqueValues("model").map((model, index) => (
            <option key={index} value={model}>
              {model}
            </option>
          ))}
        </select>
        <select name="capacity" value={filters.capacity} onChange={handleFilterChange}>
          <option value="">All Capacities</option>
          {getUniqueCapacities().map((item, index) => (
            <option key={index} value={item.capacity}>
              {`${item.capacity} ${item.capacityUnit}`}
            </option>
          ))}
        </select>
        <button className={styles.button} onClick={handleResetFilters}>
          Reset Filters
        </button>
        <button className={styles.button} onClick={handleExportToExcel}>
          Export
        </button>
      </div>
      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
            <th className={styles.tableHeader}>S No</th>
              <th onClick={() => requestSort("custId")}>Customer ID</th>
              <th onClick={() => requestSort("customerName")}>Customer Name</th>
              <th onClick={() => requestSort("customerAddress")}>Customer Address</th>
              <th onClick={() => requestSort("region")}>Region</th>
              <th onClick={() => requestSort("branch")}>Branch</th>
              <th onClick={() => requestSort("breakdown")}>Breakdown</th>
              <th onClick={() => requestSort("installation")}>Installation</th>
              <th onClick={() => requestSort("pm")}>PM</th>
            </tr>
          </thead>
          <tbody>
            {sortedCustomerData.map((item, index) => (
              <tr key={index}>
                <td>{item.custId}</td>
                <td>{item.customerName}</td>
                <td>{item.customerAddress}</td>
                <td>{item.region}</td>
                <td>{item.branch}</td>
                <td>{item.breakdown}</td>
                <td>{item.installation}</td>
                <td>{item.pm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerTable;
