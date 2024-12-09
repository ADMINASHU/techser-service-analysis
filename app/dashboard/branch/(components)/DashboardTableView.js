import React, { useState, useEffect } from "react";
import styles from "../../Dashboard.module.css";
import { regionList } from "@/lib/regions";

const DashboardTableView = ({ data, averageTotalVisits }) => {
  const [smartFilter, setSmartFilter] = useState(false);
  const [filters, setFilters] = useState({
    region: "ALL Region",
    branch: "",
  });
  const [filteredData, setFilteredData] = useState([]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleSmartFilterToggle = () => {
    setSmartFilter((prevSmartFilter) => !prevSmartFilter);
  };

  useEffect(() => {
    if (!data || data.length === 0) {
      setFilteredData([]);
      return;
    }

    let newFilteredData;

    if (smartFilter) {
      newFilteredData = data
        .filter((row) => row.region !== "Region")
        .filter((row) => {
          return (
            filters.region === "ALL Region" || !filters.region || row.region === filters.region
          );
        })
        .filter((row) => row.branch.toLowerCase().includes(filters.branch.toLowerCase()))
        .filter((row) => row.totalVisits > averageTotalVisits);
    } else {
      newFilteredData = data
        .filter((row) => row.region !== "Region")
        .filter((row) => {
          return (
            filters.region === "ALL Region" || !filters.region || row.region === filters.region
          );
        })
        .filter((row) => row.branch.toLowerCase().includes(filters.branch.toLowerCase()));
    }

    setFilteredData(newFilteredData);
  }, [data, filters, smartFilter]);

  const getColor = (value) => {
    const minpoint = 1000;
    const midpoint = 1800;
    const maxpoint = 3000;

    if (value <= minpoint) {
      const ratio = value / minpoint;
      return `rgb(255, ${Math.round(255 * ratio)}, ${Math.round(255 * ratio)})`; // Gradient to darker red
    } else if (value >= maxpoint) {
      const ratio = (value - midpoint) / (maxpoint - midpoint);
      return `rgb(${Math.round(255 * (1 - ratio))}, 255, ${Math.round(255 * (1 - ratio))})`; // Gradient to darker green
    } else if (value < midpoint) {
      const ratio = (value - minpoint) / (midpoint - minpoint);
      return `rgb(255, ${Math.round(255 * ratio)}, 0)`; // Gradient from red to yellow
    } else {
      const ratio = (value - midpoint) / (maxpoint - midpoint);
      return `rgb(${Math.round(255 * (1 - ratio))}, 255, 0)`; // Gradient from yellow to green
    }
  };

  if (!data || data.length === 0) return <div>No data available</div>;

  return (
    <div className={styles.page}>
      <div className={styles.filterContainer}>
        <button
          className={styles.button}
          style={
            smartFilter
              ? { backgroundColor: "green", color: "white", textAlign: "center" }
              : { backgroundColor: "#e90c0c", color: "white", textAlign: "center" }
          }
          onClick={handleSmartFilterToggle}
        >
          {smartFilter ? "Smart" : "Regular"}
        </button>

        <select name="region" value={filters.region} onChange={handleFilterChange}>
          <option value="ALL Region">ALL Region</option>
          {regionList.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="branch"
          value={filters.branch}
          placeholder="Search Branch"
          onChange={handleFilterChange}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th colSpan={3}>Dashboard Branch</th>
            <th colSpan={1}>Entry</th>
            <th colSpan={3}>New</th>
            <th colSpan={3}>Pending</th>
            <th colSpan={3}>Closed in 1st Attempt</th>
            <th colSpan={3}>Pending Call Closed</th>
            <th colSpan={3}>Total</th>
            <th colSpan={1}>Index</th>
            <th colSpan={1}>Accuracy</th>
          </tr>
          {data?.length > 0 && (
            <tr>
              {Object.values(data[0])?.map((value, index) => (
                <th key={index}>{value}</th>
              ))}
            </tr>
          )}
        </thead>
        <tbody>
          {filteredData?.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.values(row)?.map((value, colIndex) => (
                <td
                  key={colIndex}
                  style={colIndex === 19 ? { backgroundColor: getColor(value) } : {}}
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardTableView;
