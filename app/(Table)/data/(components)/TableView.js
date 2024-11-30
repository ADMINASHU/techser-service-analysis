import React, { useState, useEffect } from "react";
import styles from "./page.module.css";

const TableView = ({ data }) => {
  const selectedColumns = [
    "complaintID",
    "natureOfComplaint",
    "regDate",
    "closedDate",
    "duration",
    "realStatus",
    "assignedTo",
    "region",
    "branch",
    "month",
    "year",
    "count",
    "isPending",
    "cPoint",
    "ePoint",
    "bPoint",
    "rPoint",
  ];

  const regionList = [
    "AP & TELANGANA",
    "CHATTISGARH",
    "GOA",
    "KALKA",
    "KARNATAKA",
    "KERALA",
    "MADHYA PRADESH",
    "MUMBAI",
    "RAJASTHAN",
    "TAMIL NADU",
    "West Bengal",
  ];

  const [filters, setFilters] = useState({
    year: data[data.length - 1]?.year,
    month: data[data.length - 1]?.month,
    region: "ALL Region",
    branch: "",
    natureOfComplaint: "",
    realStatus: "",
    assignedTo: "",
    complaintID: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  useEffect(() => {
    if (!filters.region || filters.region === "ALL Region") {
      setFilters((prevFilters) => ({ ...prevFilters, branch: "", assignedTo: "" }));
    } else if (!filters.branch) {
      setFilters((prevFilters) => ({ ...prevFilters, assignedTo: "" }));
    }
  }, [filters.region, filters.branch]);

  const filteredData = data.filter((row) => {
    return (
      (!filters.year || row.year === filters.year) &&
      (!filters.month || row.month === filters.month) &&
      (filters.region === "ALL Region" || !filters.region || row.region === filters.region) &&
      (!filters.branch || row.branch === filters.branch) &&
      (!filters.natureOfComplaint || row.natureOfComplaint === filters.natureOfComplaint) &&
      (!filters.realStatus || row.realStatus === filters.realStatus) &&
      (!filters.assignedTo || row.assignedTo === filters.assignedTo) &&
      (!filters.complaintID || row.complaintID.toLowerCase().includes(filters.complaintID.toLowerCase()))
    );
  });

  const filteredBranches =
    !filters.region || filters.region === "ALL Region"
      ? Array.from(new Set(data.map((row) => row.branch)))
      : Array.from(
          new Set(data.filter((row) => row.region === filters.region).map((row) => row.branch))
        );

  const filteredAssignedTo = !filters.branch
    ? Array.from(new Set(data.map((row) => row.assignedTo)))
    : Array.from(
        new Set(data.filter((row) => row.branch === filters.branch).map((row) => row.assignedTo))
      );

  return (
    <div className={styles.page}>
      <div className={styles.filterContainer}>
        <select name="year" value={filters.year} onChange={handleFilterChange}>
          <option value="">Select Year</option>
          {Array.from(new Set(data.map((row) => row.year))).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <select name="month" value={filters.month} onChange={handleFilterChange}>
          <option value="">Select Month</option>
          {Array.from(new Set(data.map((row) => row.month))).map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
        <select name="region" value={filters.region} onChange={handleFilterChange}>
          <option value="ALL Region">ALL Region</option>
          {regionList.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
        <select name="branch" value={filters.branch} onChange={handleFilterChange}>
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
          <option value="BREAKDOWN">BREAKDOWN</option>
          <option value="INSTALLATION">INSTALLATION</option>
          <option value="PM">PM</option>
        </select>

        <select name="realStatus" value={filters.realStatus} onChange={handleFilterChange}>
          <option value="">Select Status</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="IN PROCESS">IN PROCESS</option>
          <option value="NEW">NEW</option>
        </select>

        <select name="assignedTo" value={filters.assignedTo} onChange={handleFilterChange}>
          <option value="">Select Assigned To</option>
          {filteredAssignedTo.map((assigned, i) => (
            <option key={i} value={assigned}>
              {assigned}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="complaintID"
          value={filters.complaintID}
          placeholder="Search Complaint ID"
          onChange={handleFilterChange}
          style={{ marginLeft: "10px" }}
        />
      </div>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            {selectedColumns.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {selectedColumns.map((col, index) => (
                <td key={index}>{row[col] !== undefined ? row[col] : ""}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableView;
