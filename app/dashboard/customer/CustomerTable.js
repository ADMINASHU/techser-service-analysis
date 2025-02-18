"use client";

import React, { useContext, useState, useMemo, useEffect } from "react";
import CustomerProvider from "@/context/CustomerContext";
import styles from "../Dashboard.module.css";
import { utils, writeFile } from "xlsx";
import { regionList } from "@/lib/regions";

const CustomerTable = () => {
  const { customerData, filters, setFilters } = useContext(CustomerProvider);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const getBranchesForRegion = (region) => {
    const branches = new Set();
    customerData.forEach((row) => {
      if ((region === "" || row.region === region) && row.branch !== "Branch") {
        branches.add(row.branch);
      }
    });
    return Array.from(branches);
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

  useEffect(() => {
    if (!filters.region || filters.region === "") {
      setFilters((prevFilters) => ({
        ...prevFilters,
        branch: "",
        name: "",
        category: "",
        series: "",
        model: "",
        capacity: "",
      }));
    }
  }, [filters.region]);

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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const paginatedData = sortedCustomerData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(sortedCustomerData.length / rowsPerPage);

  const getPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={currentPage === 1 ? styles.activePageButton : styles.pageButton}
        >
          1
        </button>
      );
      buttons.push(
        <span key="start-ellipsis" className={styles.ellipsis}>
          ...
        </span>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      if (i === 1) continue;
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={i === currentPage ? styles.activePageButton : styles.pageButton}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      buttons.push(
        <span key="end-ellipsis" className={styles.ellipsis}>
          ...
        </span>
      );
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={currentPage === totalPages ? styles.activePageButton : styles.pageButton}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className={styles.page}>
      <div className={styles.filterContainer}>
        <select name="region" value={filters.region} onChange={handleFilterChange}>
          <option value="">ALL Region</option>
          {regionList.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
        <select name="branch" value={filters.branch} onChange={handleFilterChange}>
          <option value="">ALL Branch</option>
          {getBranchesForRegion(filters.region).map((branch, index) => (
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
        <button className={styles.ResetButton} onClick={handleResetFilters}>
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
                Customer ID{" "}
                {sortConfig.key === "custId" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className={styles.tableHeader} onClick={() => handleSort("customerName")}>
                Customer Name{" "}
                {sortConfig.key === "customerName"
                  ? sortConfig.direction === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>
              <th className={styles.tableHeader} onClick={() => handleSort("customerAddress")}>
                Customer Address{" "}
                {sortConfig.key === "customerAddress"
                  ? sortConfig.direction === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>
              <th className={styles.tableHeader} onClick={() => handleSort("state")}>
                State{" "}
                {sortConfig.key === "state" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className={styles.tableHeader} onClick={() => handleSort("pincode")}>
                Pincode{" "}
                {sortConfig.key === "pincode" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className={styles.tableHeader} onClick={() => handleSort("region")}>
                Region{" "}
                {sortConfig.key === "region" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className={styles.tableHeader} onClick={() => handleSort("branch")}>
                Branch{" "}
                {sortConfig.key === "branch" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className={styles.tableHeader} onClick={() => handleSort("breakdown")}>
                Breakdown{" "}
                {sortConfig.key === "breakdown" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className={styles.tableHeader} onClick={() => handleSort("installation")}>
                Installation{" "}
                {sortConfig.key === "installation"
                  ? sortConfig.direction === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>
              <th className={styles.tableHeader} onClick={() => handleSort("pm")}>
                PM {sortConfig.key === "pm" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr key={index} className={styles.tableRow}>
                <td className={styles.tableCell}>
                  <div className={styles.tableCellContent}>
                    {(currentPage - 1) * rowsPerPage + index + 1}
                  </div>
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
                  <div className={styles.tableCellContent}>{item.state}</div>
                </td>
                <td className={styles.tableCell}>
                  <div className={styles.tableCellContent}>{item.pincode}</div>
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
      <div className={styles.paginationContainer}>
        <div className={styles.countDisplay}>
          Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
          {Math.min(currentPage * rowsPerPage, sortedCustomerData.length)} {`of `}
          <span style={{ color: "#e63946" }}>{sortedCustomerData.length}</span>
          {` entries`}
        </div>
        <div className={styles.paginationButtons}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.pageButton}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className={styles.icon}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          {getPaginationButtons()}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={styles.pageButton}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className={styles.icon}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerTable;
