import React, { useState, useEffect } from "react";
import styles from "../../Dashboard.module.css";

const DashboardTableView = ({ data, averageTotalVisits }) => {
  const [smartFilter, setSmartFilter] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSmartFilterToggle = () => {
    setSmartFilter((prevSmartFilter) => !prevSmartFilter);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
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
        .filter((row) => row.totalVisits > averageTotalVisits);
    } else {
      newFilteredData = data.filter((row) => row.region !== "Region");
    }

    if (sortConfig.key) {
      newFilteredData = [...newFilteredData].sort((a, b) => {
        const aValue = isNaN(a[sortConfig.key]) ? a[sortConfig.key] : parseFloat(a[sortConfig.key]);
        const bValue = isNaN(b[sortConfig.key]) ? b[sortConfig.key] : parseFloat(b[sortConfig.key]);

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
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
      </div>

      <table>
        <thead>
          <tr>
            <th colSpan={3}>Dashboard Region</th>
            <th colSpan={1}>Entry</th>
            <th colSpan={3}>New</th>
            <th colSpan={3}>Pending</th>
            <th colSpan={3}>Closed in 1st Attempt</th>
            <th colSpan={3}>Pending Call Closed</th>
            <th colSpan={4}>Total</th>
            <th colSpan={1}>Index</th>
            <th colSpan={1}>Accuracy</th>
          </tr>
          {data?.length > 0 && (
            <tr>
              {Object.values(data[0])?.map((value, index) => (
                <th key={index} onClick={() => handleSort(Object.keys(data[0])[index])}>
                  {value} {sortConfig.key === Object.keys(data[0])[index] ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                </th>
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
                  style={colIndex === 20 ? { backgroundColor: getColor(value) } : {}}
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
