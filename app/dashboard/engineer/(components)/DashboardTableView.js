import React from "react";

const DashboardTableView = ({ data }) => {
  if (!data || data.length === 0) return <div>No data available</div>;

  return (
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
        <tr>
          {Object.values(data[0]).map((key,index) => (
            <th key={index}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.slice(1).map((row, rowIndex) => (
          <tr key={rowIndex}>
            {Object.values(row).map((value, colIndex) => (
              <td key={colIndex}>{value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DashboardTableView;
