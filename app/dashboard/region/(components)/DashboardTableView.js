import React, { useState, useEffect, useRef } from "react";
import styles from "../../Dashboard.module.css";

const DashboardTableView = ({ data, averageTotalVisits, filterYear }) => {
  const tableRef = useRef();
  const [smartFilter, setSmartFilter] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [hoveredRow, setHoveredRow] = useState(null);

  const selectedColumns = [
    "region",
    "branch",
    "engineer",
    "totalCallAssigned",
    "newBreakdown",
    "newInstallation",
    "newPM",
    "pendBreakdown",
    "pendInstallation",
    "pendPM",
    "closeBreakdown",
    "closeInstallation",
    "closePM",
    "pCloseBreakdown",
    "pCloseInstallation",
    "pClosePM",
    "totalVisits",
    "ePoint",
    "bPoint",
    "rPoint",
    "index",
    "accuracy",
  ];

  const handleSmartFilterToggle = () => {
    setSmartFilter((prevSmartFilter) => !prevSmartFilter);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  useEffect(() => {
    if (!data || data.length === 0) {
      setFilteredData([]);
      return;
    }

    let newFilteredData = smartFilter
      ? data
          .filter((row) => row.region !== "Region")
          .filter((row) => row.totalVisits > averageTotalVisits)
      : data.filter((row) => row.region !== "Region");

    if (sortConfig.key) {
      newFilteredData = [...newFilteredData].sort((a, b) => {
        const aValue = isNaN(a[sortConfig.key]) ? a[sortConfig.key] : parseFloat(a[sortConfig.key]);
        const bValue = isNaN(b[sortConfig.key]) ? b[sortConfig.key] : parseFloat(b[sortConfig.key]);
        return sortConfig.direction === "asc"
          ? aValue < bValue
            ? -1
            : 1
          : aValue > bValue
          ? -1
          : 1;
      });
    }

    setFilteredData(newFilteredData);
  }, [data, smartFilter, sortConfig, averageTotalVisits]);

  const getColor = (value) => {
    const strPoint = -3000;
    const minPoint = 1000;
    const midPoint = 1800;
    const greenPoint = 2000;
    const maxPoint = 3000;

    if (value <= strPoint) {
      return `rgb(139,0,0)`; // Dark red for very low values
    } else if (value <= minPoint) {
      const ratio = (value - strPoint) / (minPoint - strPoint);
      return `rgb(255, ${Math.round(64 * ratio)}, ${Math.round(64 * ratio)})`; // Gradient from dark red to light red
    } else if (value <= midPoint) {
      const ratio = (value - minPoint) / (midPoint - minPoint);
      return `rgb(255, ${Math.round(255 * ratio)}, 0)`; // Gradient from light red to light green
    } else if (value <= greenPoint) {
      const ratio = (value - midPoint) / (greenPoint - midPoint);
      return `rgb(${Math.round(255 * (1 - ratio))}, 255, 0)`; // Gradient from light green to green
    } else if (value <= maxPoint) {
      const ratio = (value - greenPoint) / (maxPoint - greenPoint);
      return `rgb(0, ${Math.round(255 * (1 - ratio))}, 0)`; // Gradient from green to dark green
    } else {
      return `rgb(0,100,0)`; // Dark green for values above maxPoint
    }
  };

  const handlePrint = () => {
    const printContent = tableRef.current;
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Table</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid black; padding: 8px; text-align: center; }
          </style>
        </head>
        <body>${printContent.outerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleRowMouseEnter = (rowIndex) => {
    setHoveredRow(rowIndex);
  };

  const handleRowMouseLeave = () => {
    setHoveredRow(null);
  };

  if (!data || data.length === 0) return <div>No data available</div>;

  return (
    <div className={styles.page}>
      <div className={styles.filterContainer}>
        <label className={styles.toggleSwitch}>
          <input type="checkbox" checked={smartFilter} onChange={handleSmartFilterToggle} />
          <span className={styles.slider}>
            <span className={styles.toggleText}>{smartFilter ? "Smart" : "Regular"}</span>
          </span>
        </label>

        <button className={styles.print} onClick={handlePrint}>
          Print
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table ref={tableRef}>
          <thead>
            <tr>
              <th colSpan={4} className={styles.tableHeader}>
                {`Dashboard Region [${
                  filterYear ? filterYear : new Date().getFullYear().toString()
                }]`}
              </th>
              <th colSpan={1} className={styles.tableHeader}>
                Entry
              </th>
              <th colSpan={3} className={styles.tableHeader}>
                New
              </th>
              <th colSpan={3} className={styles.tableHeader}>
                Pending
              </th>
              <th colSpan={3} className={styles.tableHeader}>
                Closed in 1st Attempt
              </th>
              <th colSpan={3} className={styles.tableHeader}>
                Pending Call Closed
              </th>
              <th colSpan={4} className={styles.tableHeader}>
                Total
              </th>
              <th colSpan={1} className={styles.tableHeader}>
                Index
              </th>
              <th colSpan={1} className={styles.tableHeader}>
                Accuracy
              </th>
            </tr>
            {data?.length > 0 && (
              <tr>
                <th className={styles.tableHeader}>S.No.</th>
                {selectedColumns.map((col, index) => (
                  <th key={index} onClick={() => handleSort(col)} className={styles.tableHeader}>
                    {data[0][col]}
                    {sortConfig.key === col ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                  </th>
                ))}
              </tr>
            )}
          </thead>
          <tbody>
            {filteredData?.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={styles.tableRow}
                onMouseEnter={() => handleRowMouseEnter(rowIndex)}
                onMouseLeave={handleRowMouseLeave}
              >
                <td className={hoveredRow === rowIndex ? styles.activeCell : ""}>{rowIndex + 1}</td>

                {selectedColumns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    style={colIndex === 20 ? { backgroundColor: getColor(row[col]) } : {}}
                    className={`${styles.tableCell} ${
                      hoveredRow === rowIndex ? styles.activeCell : ""
                    }`}
                  >
                    <div className={styles.tableCellContent}>{row[col]}</div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardTableView;
