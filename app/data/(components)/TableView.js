import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import { regionList } from "@/lib/regions";

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

  const getCurrentMonthName = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[new Date().getMonth()];
  };

  const [filters, setFilters] = useState({
    year: new Date().getFullYear().toString(),
    month: getCurrentMonthName(),
    region: "ALL Region",
    branch: "",
    natureOfComplaint: "",
    realStatus: "",
    assignedTo: "",
    complaintID: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState(null);

  const rowsPerPage = 50;

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
      (!filters.complaintID ||
        row.complaintID.toLowerCase().includes(filters.complaintID.toLowerCase()))
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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

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

  const handleRowMouseEnter = (rowIndex) => {
    setHoveredRow(rowIndex);
  };

  const handleRowMouseLeave = () => {
    setHoveredRow(null);
  };

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

      <div className={styles.tableContainer}>
        <table >
          <thead >
            <tr>
              {selectedColumns.map((col, index) => (
                <th  className={styles.tableHeader} key={index}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onMouseEnter={() => handleRowMouseEnter(rowIndex)}
                onMouseLeave={handleRowMouseLeave}
              >
                {selectedColumns.map((col, index) => (
                  <td key={index} className={`${hoveredRow === rowIndex ? styles.activeCell : ""}`}>
                    {row[col] !== undefined ? row[col] : ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.paginationContainer}>
        <div className={styles.countDisplay}>
          Showing {(currentPage - 1) * rowsPerPage + 1} to{" "}
          {Math.min(currentPage * rowsPerPage, filteredData.length)} {`of `}
          <span style={{ color: "#e63946" }}>{filteredData.length}</span>
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

export default TableView;
