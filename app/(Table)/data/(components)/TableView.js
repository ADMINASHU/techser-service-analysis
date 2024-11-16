import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
const TableView = ({ data, selectedColumns }) => {
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
      const latestYear = latestRow ? latestRow[latestRow.length - 3] : "";
      const latestMonth = latestRow ? latestRow[latestRow.length - 4] : "";
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

    const year = row[row.length - 3];
    const month = row[row.length - 4];
    const region = row[row.length - 6];
    const branch = row[row.length - 5];
    const natureOfComplaint = row[row.length - 9];
    const realStatus = row[row.length - 1];
    const assignedTo = row[row.length - 7];

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
      ? Array.from(new Set(data.slice(1).map((row) => row[row.length - 5])))
      : Array.from(
          new Set(
            data
              .slice(1)
              .filter((row) => row.length > 6 && row[row.length - 6] === filters.region)
              .map((row) => row[row.length - 5])
          )
        );

  const filteredAssignedTo =
    filters.branch === ""
      ? Array.from(new Set(data.slice(1).map((row) => row[row.length - 7])))
      : Array.from(
          new Set(
            data
              .slice(1)
              .filter((row) => row.length > 7 && row[row.length - 5] === filters.branch)
              .map((row) => row[row.length - 7])
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
                .filter((row) => row.length > 3)
                .map((row) => row[row.length - 3])
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
                .filter((row) => row.length > 4)
                .map((row) => row[row.length - 4])
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
                .filter((row) => row.length > 6)
                .map((row) => row[row.length - 6])
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
          // disabled={!filters.region || filters.region === "ALL Region"}
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
                .filter((row) => row.length > 9)
                .map((row) => row[row.length - 9])
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
                .filter((row) => row.length > 1)
                .map((row) => row[row.length - 1])
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
          // disabled={!filters.branch}
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
