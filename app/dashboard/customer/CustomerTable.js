"use client";

import React, { useContext, useState, useMemo } from "react";
import ProductContext from "@/context/ProductContext";
import styles from "../Dashboard.module.css";
import { utils, writeFile } from "xlsx";

const CustomerTable = () => {
  const { customerData, filters, setFilters } = useContext(ProductContext);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

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
    utils.book_append_sheet(workbook, worksheet, "Customer Data");
    writeFile(workbook, "CustomerData.xlsx");
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedCustomerData = useMemo(() => {
    if (sortConfig.key) {
      return [...customerData].sort((a, b) => {
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
    return customerData;
  }, [customerData, sortConfig]);

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
              <th className={styles.tableHeader} onClick={() => handleSort("custId")}>
                Customer ID {sortConfig.key === "custId" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className={styles.tableHeader} onClick={() => handleSort("customerName")}>
                Customer Name {sortConfig.key === "customerName" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className={styles.tableHeader} onClick={() => handleSort("customerAddress")}>
                Customer Address {sortConfig.key === "customerAddress" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className={styles.tableHeader} onClick={() => handleSort("region")}>
                Region {sortConfig.key === "region" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className={styles.tableHeader} onClick={() => handleSort("branch")}>
                Branch {sortConfig.key === "branch" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className={styles.tableHeader} onClick={() => handleSort("breakdown")}>
                Breakdown {sortConfig.key === "breakdown" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className={styles.tableHeader} onClick={() => handleSort("installation")}>
                Installation {sortConfig.key === "installation" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className={styles.tableHeader} onClick={() => handleSort("pm")}>
                PM {sortConfig.key === "pm" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedCustomerData.map((item, index) => (
              <tr key={index} className={styles.tableRow}>
                <td className={styles.tableCell}>
                  <div className={styles.tableCellContent}>{index + 1}</div>
                </td>
                <td className={styles.tableCell}>
                  <div className={styles.tableCellContent}>{item.custId}</div>
                </td>
                <td className={styles.tableCell}>
                  <div className={styles.tableCellContent}>{item.customerName}</div>
                </td>
                <td className={styles.tableCell}>
                  <div className={styles.tableCellContent}>{item.customerAddress}</div>
                </td>
                <td className={styles.tableCell}>
                  <div className={styles.tableCellContent}>{item.region}</div>
                </td>
                <td className={styles.tableCell}>
                  <div className={styles.tableCellContent}>{item.branch}</div>
                </td>
                <td className={styles.tableCell}>
                  <div className={styles.tableCellContent}>{item.breakdown}</div>
                </td>
                <td className={styles.tableCell}>
                  <div className={styles.tableCellContent}>{item.installation}</div>
                </td>
                <td className={styles.tableCell}>
                  <div className={styles.tableCellContent}>{item.pm}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerTable;
