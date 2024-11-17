import React, { useState, useEffect } from "react";
import styles from "./page.module.css";

const TableView = ({ data, selectedColumns }) => {
  // console.log("page: " +  JSON.stringify(data));

  const [filters, setFilters] = useState({
    year: "",
    month: "",
    region: "ALL Region",
    branch: "",
    natureOfComplaint: "",
    realStatus: "",
    assignedTo: "",
  });

  useEffect(() => {
    // Set the default values for year and month based on the latest data row
    if (data.length > 1) {
      const latestRow = data[data.length - 1];
      const latestYear = latestRow ? latestRow[24] : "";
      const latestMonth = latestRow ? latestRow[23] : "";
      setFilters((prevFilters) => ({
        ...prevFilters,
        year: latestYear,
        month: latestMonth,
      }));
    }
  }, [data]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  useEffect(() => {
    // Reset branch and assignedTo filters if their dependencies change
    if (!filters.region || filters.region === "ALL Region") {
      setFilters((prevFilters) => ({ ...prevFilters, branch: "", assignedTo: "" }));
    } else if (!filters.branch) {
      setFilters((prevFilters) => ({ ...prevFilters, assignedTo: "" }));
    }
  }, [filters.region, filters.branch]);

  const filteredData = data.filter((row, index) => {
    if (index === 0) return true; // Always include header row

    // Ensure row has expected columns
    if (!row || row.length < 12) {
      console.warn(`Skipping row ${index} due to insufficient columns:`, row);
      return false;
    }

    const year = row[24];
    const month = row[23];
    const region = row[21];
    const branch = row[22];
    const natureOfComplaint = row[18];
    const realStatus = row[26];
    const assignedTo = row[20];

    return (
      (filters.year === "" || year === filters.year) &&
      (filters.month === "" || month === filters.month) &&
      (filters.region === "ALL Region" || filters.region === "" || region === filters.region) &&
      (filters.branch === "" || branch === filters.branch) &&
      (filters.natureOfComplaint === "" || natureOfComplaint === filters.natureOfComplaint) &&
      (filters.realStatus === "" || realStatus === filters.realStatus) &&
      (filters.assignedTo === "" || assignedTo === filters.assignedTo)
    );
  });

  const filteredBranches =
    filters.region === "" || filters.region === "ALL Region"
      ? Array.from(new Set(data.slice(1).map((row) => row[22])))
      : Array.from(
          new Set(
            data
              .slice(1)
              .filter((row) => row[21] === filters.region)
              .map((row) => row[22])
          )
        );

  const filteredAssignedTo =
    filters.branch === ""
      ? Array.from(new Set(data.slice(1).map((row) => row[20])))
      : Array.from(
          new Set(
            data
              .slice(1)
              .filter((row) => row[22] === filters.branch)
              .map((row) => row[20])
          )
        );

  return (
    <div className={styles.page}>
      <div className={styles.filterContainer}>
        <select name="year" value={filters.year} onChange={handleFilterChange}>
          <option value="">Select Year</option>
          {Array.from(
            new Set(
              data
                .slice(1)
                .map((row) => row[24])
            )
          ).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <select name="month" value={filters.month} onChange={handleFilterChange}>
          <option value="">Select Month</option>
          {Array.from(
            new Set(
              data
                .slice(1)
                .map((row) => row[23])
            )
          ).map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
        <select name="region" value={filters.region} onChange={handleFilterChange}>
          <option value="ALL Region">ALL Region</option>
          {Array.from(
            new Set(
              data
                .slice(1)
                .map((row) => row[21])
            )
          ).map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
        <select
          name="branch"
          value={filters.branch}
          onChange={handleFilterChange}
        >
          <option value="">Select Branch</option>
          {filteredBranches.map((branch) => (
            <option key={branch} value={branch}>
              {branch}
            </option>
          ))}
        </select>
        <select
          name="natureOfComplaint"
          value={filters.natureOfComplaint}
          onChange={handleFilterChange}
        >
          <option value="">Select Nature of Complaint</option>
          {Array.from(
            new Set(
              data
                .slice(1)
                .map((row) => row[18])
            )
          ).map((nature) => (
            <option key={nature} value={nature}>
              {nature}
            </option>
          ))}
        </select>
        <select name="realStatus" value={filters.realStatus} onChange={handleFilterChange}>
          <option value="">Select Real Status</option>
          {Array.from(
            new Set(
              data
                .slice(1)
                .map((row) => row[26])
            )
          ).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <select
          name="assignedTo"
          value={filters.assignedTo}
          onChange={handleFilterChange}
        >
          <option value="">Select Assigned To</option>
          {filteredAssignedTo.map((assigned) => (
            <option key={assigned} value={assigned}>
              {assigned}
            </option>
          ))}
        </select>
      </div>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            {selectedColumns.map((colIndex) => (
              <th key={colIndex}>{data[0] && data[0][colIndex]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.slice(1).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {selectedColumns.map((colIndex) => (
                <td key={colIndex}>{row[colIndex] !== undefined ? row[colIndex] : ""}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableView;
