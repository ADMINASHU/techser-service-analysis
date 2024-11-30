import React, { useState, useEffect } from "react";
import styles from "../../Dashboard.module.css";

const DashboardTableView = ({ data }) => {
  const [smartFilter, setSmartFilter] = useState(false);
  const [filters, setFilters] = useState({
    region: "ALL Region",
    branch: "ALL Branch",
    engineer: "",
  });
  const [filteredData, setFilteredData] = useState([]);
  if (!data || data.length === 0) return <div>No data available</div>;

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

  const getBranchesForRegion = (region) => {
    const branches = new Set();
    data.forEach((row) => {
      if (region === "ALL Region" || row.region === region) {
        branches.add(row.branch);
      }
    });
    return Array.from(branches);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleSmartFilterToggle = () => {
    setSmartFilter((prevSmartFilter) => !prevSmartFilter);
  };

  useEffect(() => {
    let newFilteredData;

    if (smartFilter) {
      newFilteredData = data
        .filter((row) => row.region !== "Region")
        .filter((row) => {
          return (
            filters.region === "ALL Region" || !filters.region || row.region === filters.region
          );
        })
        .filter((row) => {
          return (
            filters.branch === "ALL Branch" || !filters.branch || row.branch === filters.branch
          );
        })
        .filter((row) => row.engineer.toLowerCase().includes(filters.engineer.toLowerCase()))
        .filter((row) => row.totalVisits > 30);
    } else {
      newFilteredData = data
        .filter((row) => row.region !== "Region")
        .filter((row) => {
          return (
            filters.region === "ALL Region" || !filters.region || row.region === filters.region
          );
        })
        .filter((row) => {
          return (
            filters.branch === "ALL Branch" || !filters.branch || row.branch === filters.branch
          );
        })
        .filter((row) => row.engineer.toLowerCase().includes(filters.engineer.toLowerCase()));
    }

    setFilteredData(newFilteredData);
  }, [data, filters, smartFilter]);

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

        <select name="branch" value={filters.branch} onChange={handleFilterChange}>
          <option value="ALL Branch">ALL Branch</option>
          {getBranchesForRegion(filters.region).map((branch) => (
            <option key={branch} value={branch}>
              {branch}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="engineer"
          value={filters.engineer}
          placeholder="Search Engineer"
          onChange={handleFilterChange}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th colSpan={3}>Dashboard Engineer</th>
            <th colSpan={1}>Assigned</th>
            <th colSpan={3}>New</th>
            <th colSpan={3}>Pending</th>
            <th colSpan={3}>Closed in 1st Attempt</th>
            <th colSpan={3}>Pending Call Closed</th>
            <th colSpan={2}>Total</th>
            <th colSpan={1}>Index</th>
            <th colSpan={1}>Accuracy</th>
          </tr>
          {data?.length > 0 && (
            <tr>
              {Object.values(data[0])?.map((key, index) => (
                <th key={index}>{key}</th>
              ))}
            </tr>
          )}
        </thead>
        <tbody>
          {filteredData?.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.values(row)?.map((value, colIndex) => (
                <td key={colIndex}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DashboardTableView;
