import React from "react";
import styles from "../../Dashboard.module.css";

const DashboardTableView = ({ data }) => {
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
        <tr>
          {Object.values(data[0]).map((key, index) => (
            <th key={index}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.slice(1).map((row, rowIndex) => (
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
  );
};

export default DashboardTableView;
